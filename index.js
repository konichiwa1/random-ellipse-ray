let canvas = document.getElementById('canvas');
let ctx;
let ellipseRay;

const init = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx.transform(1, 0, 0, -1, canvas.width/2, canvas.height/2);

    let a = getRandomNumber(canvas.width/16, canvas.width/2);
    let b = getRandomNumber(canvas.height/16, canvas.height/2);

    let lck = getRandomNumber(1, 1000);
    if(lck > 450 && lck < 600) a=Math.min(a,b);

    let rayx = 1000, rayy = 1000;
    while(rayx*rayx/(a*a) + (rayy*rayy)/(b*b) >= 1) {
        rayx = getRandomNumber(-a+0.1, a-0.1);
        rayy = getRandomNumber(-b+0.1, b-0.1);
    }

    let vel = 12;
    let theta = getRandomNumber(0, 2*Math.PI);
    let velx = vel*Math.cos(theta);
    let vely = vel*Math.sin(theta);

    ellipseRay = new EllipseRay({
        a: a,
        b: b,
        rayx: rayx,
        rayy: rayy,
        u: {x: velx, y: vely},
        ctx,
        tracer: [],
        w: canvas.width,
        h: canvas.height
    });
}

const getRandomNumber = (l, r) => {
    return Math.random()*(r-l) + l;
} 

const animate = () => {
    window.requestAnimationFrame(animate);
    ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

    ellipseRay.calculate();
}

window.onload = window.onresize = () => {
    init();
}

init();
animate();