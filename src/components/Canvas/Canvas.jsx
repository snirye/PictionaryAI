// src/components/Canvas/Canvas.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, PencilBrush } from 'fabric';
import { useGame } from '../../context/GameContext';
import './Canvas.css';

const DrawingCanvas = ({ onDrawingUpdate }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const { clearCanvasRef } = useGame();
  const [canvasSize, setCanvasSize] = useState(() => {
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? 300 : 600,
      height: isMobile ? 300 : 450
    };
  });

  // Initialize canvas once on mount
  useEffect(() => {
    fabricCanvasRef.current = new FabricCanvas(canvasRef.current, {
      isDrawingMode: true,
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
    });

    const canvas = fabricCanvasRef.current;
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 5;
    canvas.freeDrawingBrush = brush;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const newSize = {
        width: isMobile ? 300 : 600,
        height: isMobile ? 300 : 450
      };
      canvas.setDimensions(newSize);
      setCanvasSize(newSize);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasSize]); // Added canvasSize to dependency array

  // Set up event listeners and clear function
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    clearCanvasRef.current = () => {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      const drawingData = canvas.toDataURL('png');
      onDrawingUpdate(drawingData);
    };

    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [clearCanvasRef, onDrawingUpdate]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default DrawingCanvas;