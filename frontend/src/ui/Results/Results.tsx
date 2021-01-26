import CircularProgress from '@material-ui/core/CircularProgress';
import React, { createElement, useMemo, useState } from 'react';
import { Transition } from 'src/domain/transition';
import ResultError from 'src/ui/Results/ResultError';
import { Column, LabeledSection, Row, StyledSecondary } from '../Common';
import Treemap from '../D3Visualizations/Treemap';
import TransitionTable from '../TransitionTable';
import { Occupation } from 'src/domain/occupation';
import { State } from 'src/domain/state';
import Canvg, { presets } from 'canvg';
import { jsPDF } from 'jspdf';

export interface ResultsProps {
  selectedState?: State;
  selectedOccupation?: Occupation;
  loading?: boolean;
  transitions?: Transition[];
  error?: string;
}

const Results: React.FC<ResultsProps> = ({
  selectedOccupation,
  selectedState,
  transitions: immutableTransitions = [],
  loading = false,
  error,
}) => {
  const [visualization, setVisualization] = useState<'matrix' | 'treemap'>(
    'matrix'
  );

  // Material table mutates its data, but immer freezes objects, so we clone
  // the transition data for compatibility.
  const transitions = useMemo<Transition[]>(
    () => immutableTransitions.map(t => ({ ...t })),
    [immutableTransitions]
  );

  const hasTransitions = transitions.length > 0,
    showMatrix = visualization === 'matrix' && hasTransitions,
    showTreemap = visualization === 'treemap' && hasTransitions,
    disabled = !hasTransitions || loading;

  const exportPDF = () => {
    const svgElement = document.getElementById('treemap-svg');
    const svgOuter = svgElement?.outerHTML;
    console.log(svgOuter);

    if (svgOuter && svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);

      let pdf = new jsPDF();
      let canvas = document.createElement('canvas');
      canvas.width = 1020;
      canvas.height = 768;
      document.body.appendChild(canvas);
      let ctx = canvas.getContext('2d')!;
      let v = Canvg.from(ctx, svgString);
      pdf.text('Tree Map', 10, 10);
      pdf.addSvgAsImage(svgString, 0, 15, 1020, 768);
      pdf.save('treemap');
    }
  };

  return (
    <Column>
      <LabeledSection
        title="See Transitions Data"
        subtitle="There is a choice of two ways of viewing the data."
      >
        <Row>
          <StyledSecondary
            label="See a Matrix"
            testid="matrix-button"
            onClick={() => {
              setVisualization('matrix');
            }}
            disabled={disabled}
            selected={showMatrix}
          />
          <StyledSecondary
            label="See a Treechart"
            testid="treemap-button"
            onClick={() => {
              setVisualization('treemap');
            }}
            disabled={disabled}
            selected={showTreemap}
          />
          <StyledSecondary
            label="Export Chart"
            testid="treechartPdf"
            onClick={exportPDF}
            disabled={disabled}
            selected={showTreemap}
          />
        </Row>
      </LabeledSection>
      {(() => {
        if (loading) {
          return <CircularProgress style={{ alignSelf: 'center' }} />;
        } else if (error) {
          return <ResultError error={error} />;
        } else if (showMatrix && selectedOccupation) {
          return (
            <TransitionTable
              selectedOccupation={selectedOccupation}
              selectedState={selectedState}
              transitionData={transitions}
            />
          );
        } else if (showTreemap) {
          return <Treemap data={transitions} />;
        }
      })()}
    </Column>
  );
};

export default Results;
