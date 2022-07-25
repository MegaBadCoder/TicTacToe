export function animate({ duration, draw, timing }) {
    return new Promise((resolve) => {
        const start = performance.now();

        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) {
                timeFraction = 1;
                resolve();
            }
            else if (timeFraction < 0) timeFraction = 0; 

            const progress = timing(timeFraction);

            draw(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        })
    })
}

export function linear(timeFraction: number): number {
    return timeFraction;
}


export function circ(timeFraction) {
    return 1 - Math.sin(Math.acos(timeFraction));
}

export function easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4);
}

export function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
}