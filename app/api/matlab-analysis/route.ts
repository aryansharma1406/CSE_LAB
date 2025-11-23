export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { type, netlist, input_node, output_node, input_type, duration, amplitude } = body;
      
      // Get backend URL from environment variable or use localhost for development
      const backendUrl = process.env.CIRCUIT_ANALYZER_URL || 'http://localhost:5001';
      
      // Call Python backend
      const response = await fetch(`${backendUrl}/api/matlab-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          netlist,
          input_node: input_node || '1',
          output_node: output_node || '2',
          input_type,
          duration,
          amplitude
        }),
        // Add timeout
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return Response.json(
          { 
            success: false,
            error: `Backend error (${response.status}): ${errorText || 'Unknown error'}` 
          }, 
          { status: response.status }
        );
      }
      
      const data = await response.json();
      
      if (!data.success) {
        return Response.json({ 
          success: false,
          error: data.error || 'Analysis failed' 
        }, { status: 400 });
      }
      
      return Response.json(data);
      
    } catch (error: any) {
      console.error('MATLAB analysis API error:', error);
      
      // Check if it's a connection error
      if (error.name === 'TypeError' || error.message?.includes('fetch')) {
        return Response.json(
          { 
            success: false,
            error: 'Failed to connect to Python backend. Make sure the server is running on port 5001. Run: cd circuit-analyzer-backend && python3 circuit_analyzer.py' 
          }, 
          { status: 500 }
        );
      }
      
      return Response.json(
        { 
          success: false,
          error: error.message || 'Failed to perform MATLAB-style analysis. Make sure Python server is running on port 5001.' 
        }, 
        { status: 500 }
      );
    }
  }

