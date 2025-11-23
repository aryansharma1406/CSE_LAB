-- Insert the three lab experiments
INSERT INTO public.lab_manuals (experiment_id, experiment_name, description, difficulty, category, storage_path)
VALUES
  (
    'system-modeling',
    'System Modeling and Analysis',
    'Model and analyze the step response of a second-order RC circuit using Simulink and an STM32 Microcontroller. Learn circuit analysis and hardware implementation techniques.',
    'Advanced',
    'Control Systems',
    'system-modeling-rc-circuit.pdf'
  ),
  (
    'dc-motor-modeling',
    'First and Second Order Modeling of DC Motor',
    'Transient performance analysis of DC Motor speed control circuit. Identify and model first and second-order transfer functions using STM32 and system identification tools.',
    'Advanced',
    'Control Systems',
    'dc-motor-first-second-order.pdf'
  ),
  (
    'stability-analysis',
    'Stability Analysis of Closed-Loop DC Motor',
    'Evaluate the performance of closed-loop DC motor control systems by testing various gain values and analyzing Gain and Phase Margins for stability assessment.',
    'Advanced',
    'Control Systems',
    'stability-analysis-dc-motor.pdf'
  );
