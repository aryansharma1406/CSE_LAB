'use client';

import { useState, useEffect } from 'react';
import MatlabAnalysis from './MatlabAnalysis';

export default function TransferFunctionCalculatorWithAnalysis() {
  // Initialize with default netlist so features are available immediately
  const [netlist, setNetlist] = useState(`V1 1 0 ac
R1 1 2 1k
C1 2 0 1u`);
  const [inputNode, setInputNode] = useState('1');
  const [outputNode, setOutputNode] = useState('2');
  const [transferFunctionResult, setTransferFunctionResult] = useState<any>(null);

  // Listen for transfer function calculation results
  useEffect(() => {
    const handleTransferFunctionCalculated = (event: any) => {
      if (event.detail) {
        setNetlist(event.detail.netlist || netlist);
        setInputNode(event.detail.inputNode || '1');
        setOutputNode(event.detail.outputNode || '2');
        setTransferFunctionResult(event.detail.result || null);
      }
    };

    window.addEventListener('transfer-function-calculated', handleTransferFunctionCalculated);
    return () => window.removeEventListener('transfer-function-calculated', handleTransferFunctionCalculated);
  }, [netlist]);

  // Also listen for netlist updates from TransferFunctionCalculator
  useEffect(() => {
    const handleNetlistUpdate = (event: any) => {
      if (event.detail) {
        setNetlist(event.detail.netlist || netlist);
        setInputNode(event.detail.inputNode || '1');
        setOutputNode(event.detail.outputNode || '2');
      }
    };

    window.addEventListener('netlist-updated', handleNetlistUpdate);
    return () => window.removeEventListener('netlist-updated', handleNetlistUpdate);
  }, [netlist]);

  // Always show analysis with current netlist
  return (
    <MatlabAnalysis
      netlist={netlist}
      inputNode={inputNode}
      outputNode={outputNode}
      transferFunctionResult={transferFunctionResult}
    />
  );
}

