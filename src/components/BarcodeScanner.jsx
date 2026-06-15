import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = ({ onScan }) => {
  const qrCodeRegionRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (qrCodeRegionRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        qrCodeRegionRef.current.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false // disable verbose logging
      );

      const handleScanSuccess = (decodedText) => {
        onScan(decodedText);
      };

      const handleScanFailure = (error) => {
        console.warn(`Scan failure: ${error}`);
      };

      scannerRef.current.render(handleScanSuccess, handleScanFailure);

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch((error) => {
            console.error('Failed to clear scanner:', error);
          });
        }
      };
    }
  }, [onScan]);

  return <div ref={qrCodeRegionRef} id="qr-code-region" />;
};

export default BarcodeScanner;
