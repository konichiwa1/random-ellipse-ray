const {sin, cos, atan2} = Math;

class EllipseRay{
    constructor({a, b, rayx, rayy, u, ctx, tracer, w, h, color}) {
        this.rayx = rayx;
        this.rayy = rayy;
        this.a = a;
        this.b = b;
        this.u = u;
        this.ctx = ctx;
        this.tracer = tracer;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    collided(x, y, a, b, dx, dy) {
        if((x+dx)*(x+dx)/(a*a) + (y+dy)*(y+dy)/(b*b) > 1) {
            if(dx!=0) {
                let m = dy/dx;
                let c = y-m*x;

                let x1 = a*(a*m*c + b*Math.sqrt(a*a*m*m + b*b - c*c))/(-a*a*m*m-b*b);
                let x2 = a*(a*m*c - b*Math.sqrt(a*a*m*m + b*b - c*c))/(-a*a*m*m-b*b);
                let y1 = m*x1 + c;
                let y2 = m*x2 + c;

                if((x-x1)*(x-x1)+(y-y1)*(y-y1) > (x-x2)*(x-x2)+(y-y2)*(y-y2)) {
                    x1 = x2;
                    y1 = y2;
                }

                this.rayx = x1;
                this.rayy = y1;
            } else {
                let x1 = x;
                let x2 = x;
                let y1 = (b*Math.sqrt(a*a - x*x))/a;
                let y2 = -y1;

                if((x-x1)*(x-x1)+(y-y1)*(y-y1) > (x-x2)*(x-x2)+(y-y2)*(y-y2)) {
                    x1 = x2;
                    y1 = y2;
                }

                this.rayx = x1;
                this.rayy = y1;
            }

            this.tracer.push({x:this.rayx, y:this.rayy});

            return true;
        }
        return false;
    }

    bounce() {
        let {rayx, rayy, a, b, u} = this;
        let ux = u.x, uy = u.y;
        let angle = atan2(a*a*rayy, b*b*rayx);
        u.x = -ux*cos(angle) - uy*sin(angle);
        u.y = -ux*sin(angle) + uy*cos(angle);
        ux = u.x;
        uy = u.y;
        u.x = ux*cos(-angle) + uy*sin(-angle);
        u.y = -ux*sin(-angle) + uy*cos(-angle);
    }

    calculate() {
        let {rayx, rayy, a, b, u} = this;
        if(this.collided(rayx, rayy, a, b, u.x, u.y)) this.bounce();

        this.rayx += this.u.x;
        this.rayy += this.u.y;
        this.tracer.push({x:this.rayx, y:this.rayy});

        this.draw();
    }

    draw() {
        let {ctx} = this;
        ctx.lineWidth = "2";
        // ctx.beginPath();
        // ctx.ellipse(0, 0, this.a, this.b, 0, 0, 2*Math.PI);
        // ctx.strokeStyle = "green";
        // ctx.stroke();

        if(this.tracer.length > 1) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.tracer[0].x, this.tracer[0].y);

            for(let i=1; i<this.tracer.length; i++) {
                ctx.lineTo(this.tracer[i].x, this.tracer[i].y);
            }
            ctx.lineWidth = "2";
            ctx.stroke();
        }
    }
}