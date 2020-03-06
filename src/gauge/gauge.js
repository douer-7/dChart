function Gauge(c) {
    this.el = c.el
    this.maxLineNums = c.maxLineNums
    this.unitLineNums = c.unitLineNums
    this.data = c.data
    this.title = c.title
    this.textBottom = c.textBottom
    this.isAnimation = c.isAnimation

    //生成渐变色组，可更改前两个参数改变颜色
    let gradientColor = gradientColors('#17deea', '#e97f03', this.maxLineNums + 1)


    let canvas = document.getElementById(this.el),
        ctx = canvas.getContext('2d'),
        cWidth = canvas.width,
        cHeight = canvas.height;
    ctx.textAlign = "center"

    let animationData = 0
    let startAngel = 0.75 * Math.PI
    let r = 0.4 * canvas.width

    let draw = () => {
        // 动画就是每一帧画布重绘，所以要先清除画布
        ctx.clearRect(-200, -200, 400, 400);
        ctx.beginPath();

        if (this.title !== undefined) {
            ctx.fillStyle = '#777';
            ctx.font = "18px serif";
            ctx.fillText(this.title, cWidth / 2, cHeight * 0.4); //大标题的颜色、字号、位置
        }
        if (this.textBottom !== undefined) {
            ctx.font = "12px serif";
            ctx.fillText(this.textBottom, cWidth / 2, cHeight * 0.8); //底部文字的颜色（与大标题已知，可自行增加）、字号、位置
        }


        ctx.font = "28px serif";
        ctx.fillStyle = gradientColor[animationData]; //中间数据的颜色（与指针颜色一致，可自行更改）
        ctx.fillText(animationData, cWidth / 2, cHeight * 0.55); //中间数据的位置

        for (let i = 1; i <= this.maxLineNums; i++) {
            let currentAngle = startAngel + i * (1.5 * Math.PI / this.maxLineNums)

            if (i != 0) {
                let angle = startAngel + (i - 1) * (1.5 * Math.PI / this.maxLineNums)
                for (let j = 0; j < this.unitLineNums; j++) {
                    ctx.strokeStyle = (i > animationData) ? '#cccccc' : gradientColor[i];
                    drawSmallLine(angle)
                    angle = angle + 1.5 * Math.PI / (this.maxLineNums * this.unitLineNums)
                }
            }
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 1; //单位刻度线条宽度，推荐1~2

            ctx.strokeStyle = (i > animationData) ? '#cccccc' : gradientColor[i];
            ctx.moveTo(Math.cos(currentAngle) * r * 0.75 + cWidth / 2, Math.sin(currentAngle) * r * 0.75 + cHeight / 2);
            if (i === animationData) {
                let rL = 1.2 * r
                ctx.lineTo(Math.cos(currentAngle) * rL + cWidth / 2, Math.sin(currentAngle) * rL + cHeight / 2);
            } else {
                ctx.lineTo(Math.cos(currentAngle) * r + cWidth / 2, Math.sin(currentAngle) * r + cHeight / 2);
            }
            ctx.stroke();
        }

    }

    if (this.isAnimation) {
        let animation = () => {
            draw()
            animationData++

            if (animationData <= c.data) {
                requestAnimationFrame(animation)
            }
        }
        requestAnimationFrame(animation);
    } else {
        animationData = this.data
        draw()
    }


    function drawSmallLine(currentAngle) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1; //单位刻度内线条宽度，推荐1~2
        ctx.moveTo(Math.cos(currentAngle) * r * 0.75 + cWidth / 2, Math.sin(currentAngle) * r * 0.75 + cHeight / 2);
        ctx.lineTo(Math.cos(currentAngle) * r + cWidth / 2, Math.sin(currentAngle) * r + cHeight / 2);
        ctx.stroke();

    }
}




let gradientColors = function (start, end, steps, gamma) {
    // 颜色渐变算法
    // convert #hex notation to rgb array
    let parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) {
            return 0x11 * parseInt(s, 16);
        }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
            return parseInt(s, 16);
        })
    };

    // zero-pad 1 digit to 2
    let pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    let i, j, ms, me, output = [],
        so = [];
    gamma = gamma || 1;
    let normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
    };
    start = parseColor(start).map(normalize);
    end = parseColor(end).map(normalize);
    for (i = 0; i < steps; i++) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j++) {
            so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push('#' + so.join(''));
    }
    return output;
};