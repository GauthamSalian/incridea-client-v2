'use client';

import LightRays from '@/components/LightRays';

export default function LightRaysDemo() {
    return (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0a0a0a', position: 'relative' }}>
            <div style={{ width: '100%', height: '600px', position: 'relative' }}>
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#ffffff"
                    raysSpeed={1}
                    lightSpread={0.6}
                    rayLength={3}
                    followMouse={true}
                    mouseInfluence={0.3}
                    noiseAmount={0}
                    distortion={0}
                    className="custom-rays"
                    pulsating={false}
                    fadeDistance={0.9}
                    saturation={1}
                />
            </div>

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center',
                zIndex: 10
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>LightRays Demo</h1>
                <p style={{ fontSize: '1.2rem' }}>Move your mouse to see the effect!</p>
            </div>
        </div>
    );
}
