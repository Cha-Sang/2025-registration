import Matter from 'matter-js';

export function createCustomRenderer(engine, canvas) {
    const ctx = canvas.getContext('2d');
    
    // 自适应窗口大小
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // 渲染循环
    (function loop() {
        window.requestAnimationFrame(loop);

        const width = canvas.width;
        const height = canvas.height;

        // 1. 清空背景 (极客黑)
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, width, height);

        // 绘制背景文字
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fcfaf2'; 
        
        ctx.font = 'bold 50px sans-serif';
        ctx.fillText('Welcome to Source of USTB', width / 2, height / 2 - 25);
        
        ctx.font = '27px sans-serif';
        ctx.fillText('2025 fall registration', width / 2, height / 2 + 35);
        ctx.restore();

        // 2. 获取所有物体
        const bodies = Matter.Composite.allBodies(engine.world);

        ctx.beginPath();
        
        for (let body of bodies) {
            if (body.isStatic) continue; // 墙壁不画

            const { x, y } = body.position;
            const radius = body.circleRadius; 

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(body.angle);

            // 画圆并剪裁
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.closePath();
            
            ctx.save();
            ctx.clip(); // <--- 关键：把图片切成圆的

            // 绘制图片
            if (body.plugin.image) {
                // 图片铺满圆
                ctx.drawImage(body.plugin.image, -radius, -radius, radius * 2, radius * 2);
            } else {
                // 没图片的默认色
                ctx.fillStyle = '#4CAF50';
                ctx.fill();
            }
            ctx.restore(); // 恢复剪裁前

            // 绘制边框
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore(); // 恢复位移/旋转前
        }
    })();
}