'use client'
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export const SuccessAnimation = () => {

    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('/animations/success-check.json')
            .then(res => res.json())
            .then(setAnimationData);
    }, []);
    
    return (
        <div className="flex justify-center items-center mt-6">
            <Lottie
                animationData={animationData}
                loop={false}
                className="w-32 h-32"
            />
        </div>
    )
}
