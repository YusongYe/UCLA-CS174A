class Assignment_One_Scene extends Scene_Component {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    constructor(context, control_box) {
        super(context, control_box);

        // First, include a secondary Scene that provides movement controls:
        if(!context.globals.has_controls)
            context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

        // Locate the camera here (inverted matrix).
        const r = context.width / context.height;
        context.globals.graphics_state.camera_transform = Mat4.translation([0, 0, -35]);
        context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
        // design.  Once you've told the GPU what the design of a cube is,
        // it would be redundant to tell it again.  You should just re-use
        // the one called "box" more than once in display() to draw
        // multiple cubes.  Don't define more than one blueprint for the
        // same thing here.
        const shapes = {
            'box': new Cube(),
            'ball': new Subdivision_Sphere(4),
            'prism': new TriangularPrism()
        }
        this.submit_shapes(context, shapes);

        // Make some Material objects available to you:
        this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
            ambient: .4,
            diffusivity: .4
        });
        this.plastic = this.clay.override({
            specularity: .6
        });
        
        this.lights = [new Light(Vec.of(10, 10, 20, 1), Color.of(1, .4, 1, 1), 100000)];

        this.blue = Color.of(0, 0, 1, 1);
        this.yellow = Color.of(1, 1, 0, 1);
        this.red = Color.of(1, 0, 0, 1);
        this.t = 0;
    }


    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    make_control_panel() {
        this.key_triggered_button("Hover in Place", ["m"], () => {
            this.hover = !this.hover;
        });
        this.key_triggered_button("Pause Time", ["n"], () => {
            this.paused = !this.paused;
        });
    }
    /*
    draw_legs(graphics_state,m){
        this.shapes.box.draw(
            graphics_state,
            m,
            this.plastic.override({color:this.yellow})
        );
    }
    */

    display(graphics_state) {
        // Use the lights stored in this.lights.
        graphics_state.lights = this.lights;

        // Variable m will be a temporary matrix that helps us draw most shapes.
        // It starts over as the identity every single frame - coordinate axes at the origin.
        let m = Mat4.identity();
        let sq2 = Math.sqrt(2);
                
        // Find how much time has passed in seconds, and use that to place shapes.
        if (!this.paused)
            this.t += graphics_state.animation_delta_time / 1000;
        const t = this.t;

        // TODO: Replace the below example code with your own code to draw the butterfly.
        
        // body part
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.scale(Vec.of(4,1,1))),
            this.plastic.override({color: this.yellow})
        );
        
        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-5,0,0))).times(Mat4.scale(Vec.of(1,1,1))),
            this.plastic.override({color:this.blue})
        );
        

        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(5.5,0,0))).times(Mat4.scale(Vec.of(1.5,0.75,1))),
            this.plastic.override({color:this.blue})
        );

        //wings parameter
        let lwing1_sc = Mat4.scale(Vec.of(4,0.1,4));
        let lwing2_sc = Mat4.scale(Vec.of(2*sq2,0.1,2*sq2));
        let lwing3_sc = Mat4.scale(Vec.of(4*sq2,4*sq2,0.1));
        let rwing1_sc = Mat4.scale(Vec.of(4,0.1,4));
        let rwing2_sc = Mat4.scale(Vec.of(2*sq2,0.1,2*sq2));
        let rwing3_sc = Mat4.scale(Vec.of(4*sq2,4*sq2,0.1));

        let lwing1_sp = Mat4.rotation(Math.PI/4,Vec.of(0,1,0));
        let lwing2_sp = Mat4.rotation(Math.PI/4,Vec.of(0,1,0));
        let lwing3_sp1 = Mat4.rotation(Math.PI/2*3,Vec.of(1,0,0));
        let lwing3_sp2 = Mat4.rotation(Math.PI/4,Vec.of(0,1,0));
        let rwing1_sp = Mat4.rotation(Math.PI/4,Vec.of(0,1,0));
        let rwing2_sp = Mat4.rotation(Math.PI/4,Vec.of(0,1,0));
        let rwing3_sp1 = Mat4.rotation(-Math.PI/2*3,Vec.of(1,0,0));
        let rwing3_sp2 = Mat4.rotation(-Math.PI/4,Vec.of(0,1,0));

        let lwing1_ts = Mat4.translation(Vec.of(-4,1.1,4*sq2+1));
        let lwing2_ts = Mat4.translation(Vec.of(4,1.1,5));
        let lwing3_ts = Mat4.translation(Vec.of(0,1.1,5));
        let rwing1_ts = Mat4.translation(Vec.of(-4,1.1,-4*sq2-1));
        let rwing2_ts = Mat4.translation(Vec.of(4,1.1,-5));
        let rwing3_ts = Mat4.translation(Vec.of(0,1.1,-5));

        let lwing_ro = Mat4.rotation(Math.sin(t),Vec.of(1,0,0));
        let rwing_ro = Mat4.rotation(-Math.sin(t),Vec.of(1,0,0));
        let lwing1_ro1 = Mat4.translation(Vec.of(-4,1,1));
        let lwing1_ro2 = Mat4.translation(Vec.of(4,-1,-1));
        let lwing2_ro1 = Mat4.translation(Vec.of(4,1,1));
        let lwing2_ro2 = Mat4.translation(Vec.of(-4,-1,-1));
        let lwing3_ro1 = Mat4.translation(Vec.of(0,1,1));
        let lwing3_ro2 = Mat4.translation(Vec.of(0,-1,-1));
        let rwing1_ro1 = Mat4.translation(Vec.of(-4,1,-1));
        let rwing1_ro2 = Mat4.translation(Vec.of(4,-1,1));
        let rwing2_ro1 = Mat4.translation(Vec.of(4,1,-1));
        let rwing2_ro2 = Mat4.translation(Vec.of(-4,-1,1));
        let rwing3_ro1 = Mat4.translation(Vec.of(0,1,-1));
        let rwing3_ro2 = Mat4.translation(Vec.of(0,-1,1));


        //wings
        
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(lwing1_ro1).times(lwing_ro).times(lwing1_ro2).times(lwing1_ts).times(lwing1_sp).times(lwing1_sc),
            this.plastic.override({color:this.yellow})
        );
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(lwing2_ro1).times(lwing_ro).times(lwing2_ro2).times(lwing2_ts).times(lwing2_sp).times(lwing2_sc),
            this.plastic.override({color:this.blue})
        );
        this.shapes.prism.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(lwing3_ro1).times(lwing_ro).times(lwing3_ro2).times(lwing3_ts).times(lwing3_sp2).times(lwing3_sp1).times(lwing3_sc),
            this.plastic.override({color:this.yellow})
        );

        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(rwing1_ro1).times(rwing_ro).times(rwing1_ro2).times(rwing1_ts).times(rwing1_sp).times(rwing1_sc),
            this.plastic.override({color:this.yellow})
        );
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(rwing2_ro1).times(rwing_ro).times(rwing2_ro2).times(rwing2_ts).times(rwing2_sp).times(rwing2_sc),
            this.plastic.override({color:this.blue})
        );
        this.shapes.prism.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(rwing3_ro1).times(rwing_ro).times(rwing3_ro2).times(rwing3_ts).times(rwing3_sp2).times(rwing3_sp1).times(rwing3_sc),
            this.plastic.override({color:this.yellow})
        );
        

        //legs
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-3,-1,1))).times(Mat4.rotation(Math.sin(t*5)/8,Vec.of(1,0,0))).times(Mat4.translation(Vec.of(3,1,-1)))
            .times(Mat4.translation(Vec.of(-3,-1,1))).times(Mat4.rotation((-Math.PI/4),Vec.of(1,0,0))).times(Mat4.translation(Vec.of(3,1,-1)))
            .times(Mat4.translation(Vec.of(-3,-2,1.2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-3,-1,1))).times(Mat4.rotation(Math.sin(t*5)/8,Vec.of(1,0,0))).times(Mat4.translation(Vec.of(3,1,-1)))
            .times(Mat4.translation(Vec.of(-3,-1-sq2,1+sq2))).times(Mat4.rotation((Math.PI/16),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(3,1+sq2,-1-sq2))).
            times(Mat4.translation(Vec.of(-3,-2-sq2,1.2+sq2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );

        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-2,-1,1))).times(Mat4.rotation(Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(2,1,-1)))
            .times(Mat4.translation(Vec.of(-2,-1,1))).times(Mat4.rotation((-Math.PI/4),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(2,1,-1)))
            .times(Mat4.translation(Vec.of(-2,-2,1.2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-2,-1,1))).times(Mat4.rotation(Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(2,1,-1)))
            .times(Mat4.translation(Vec.of(-2,-1-sq2,1+sq2))).times(Mat4.rotation((Math.PI/16),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(2,1+sq2,-1-sq2))).
            times(Mat4.translation(Vec.of(-2,-2-sq2,1.2+sq2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );

        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-1,-1,1))).times(Mat4.rotation(Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(1,1,-1)))
            .times(Mat4.translation(Vec.of(-1,-1,1))).times(Mat4.rotation((-Math.PI/4),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(1,1,-1)))
            .times(Mat4.translation(Vec.of(-1,-2,1.2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-1,-1,1))).times(Mat4.rotation(Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(1,1,-1)))
            .times(Mat4.translation(Vec.of(-1,-1-sq2,1+sq2))).times(Mat4.rotation((Math.PI/16),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(1,1+sq2,-1-sq2))).
            times(Mat4.translation(Vec.of(-1,-2-sq2,1.2+sq2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );

        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-1,-1,-1))).times(Mat4.rotation(-Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(1,1,1)))
            .times(Mat4.translation(Vec.of(-1,-1,-1))).times(Mat4.rotation((Math.PI/4),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(1,1,1)))
            .times(Mat4.translation(Vec.of(-1,-2,-1.2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-1,-1,-1))).times(Mat4.rotation(-Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(1,1,1)))
            .times(Mat4.translation(Vec.of(-1,-1-sq2,-1-sq2))).times(Mat4.rotation((-Math.PI/16),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(1,1+sq2,1+sq2))).
            times(Mat4.translation(Vec.of(-1,-2-sq2,-1.2-sq2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );

        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-2,-1,-1))).times(Mat4.rotation(-Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(2,1,1)))
            .times(Mat4.translation(Vec.of(-2,-1,-1))).times(Mat4.rotation((Math.PI/4),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(2,1,1)))
            .times(Mat4.translation(Vec.of(-2,-2,-1.2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-2,-1,-1))).times(Mat4.rotation(-Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(2,1,1)))
            .times(Mat4.translation(Vec.of(-2,-1-sq2,-1-sq2))).times(Mat4.rotation((-Math.PI/16),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(2,1+sq2,1+sq2))).
            times(Mat4.translation(Vec.of(-2,-2-sq2,-1.2-sq2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );

        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-3,-1,-1))).times(Mat4.rotation(-Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(3,1,1)))
            .times(Mat4.translation(Vec.of(-3,-1,-1))).times(Mat4.rotation((Math.PI/4),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(3,1,1)))
            .times(Mat4.translation(Vec.of(-3,-2,-1.2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(Mat4.translation(Vec.of(-3,-1,-1))).times(Mat4.rotation(-Math.sin(t*5)/8,Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(3,1,1)))
            .times(Mat4.translation(Vec.of(-3,-1-sq2,-1-sq2))).times(Mat4.rotation((-Math.PI/16),Vec.of(1,0,0)))
            .times(Mat4.translation(Vec.of(3,1+sq2,1+sq2))).
            times(Mat4.translation(Vec.of(-3,-2-sq2,-1.2-sq2))).times(Mat4.scale(Vec.of(0.2,1,0.2))),
            this.plastic.override({color:this.blue})
        );

        //Anttenae
        
        let an_rotationl = Mat4.rotation(Math.PI/8,Vec.of(1,0,0));
        let an_rotationr = Mat4.rotation(-Math.PI/8,Vec.of(1,0,0));

        this.draw_grass1(graphics_state, m = m.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(an_rotationr).times(Mat4.translation(Vec.of(-5, 1.125, 0)))
        .times(Mat4.scale(Vec.of(1/8,1/8,1/8))));

        let n = Mat4.identity();

        this.draw_grass1(graphics_state, m = n.times(Mat4.translation(Vec.of(0,10*(Math.sin(t)),0))).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation(Vec.of(0,0,-20))).times(an_rotationl).times(Mat4.translation(Vec.of(-5, 1.125, 0)))
        .times(Mat4.scale(Vec.of(1/8,1/8,1/8))));

        //this.draw_grass2(graphics_state, m = m.times(an_rotationr).times(Mat4.translation(Vec.of(-5, 1.125, 0)))
        //.times(Mat4.scale(Vec.of(1/8,1/8,1/8))));

        /*
        for (var i = 0; i < 3; ++i) {
            this.draw_grass(graphics_state, m = m.times(Mat4.translation(Vec.of(0, 2, 0))));
        }
        */
        
    }
    draw_grass1(graphics_state, m) {
        const deg = 2 * (Math.sin(this.t) - 2);
        this.shapes.box.draw(
            graphics_state,
            m,
            this.plastic.override({color: this.yellow}));
        for (var i = 0; i < 8; ++i) {
            let sign = (deg >= 0) ? -1 : 1;
            m = m.times(Mat4.translation(Vec.of(-1 * sign, 1, 0)))
                .times(Mat4.rotation(0.05 * deg, Vec.of(0, 0, -1)))
                .times(Mat4.translation(Vec.of(sign, 1, 0)));
            this.shapes.box.draw(
                graphics_state,
                m,
                this.plastic.override({color: (i %2) ? this.yellow : this.blue}));
        }
        this.shapes.ball.draw(graphics_state,
            m.times(Mat4.translation(Vec.of(0, 3, 0))).times(Mat4.scale(2)),
            this.plastic.override({color: this.red}));
    }

}

window.Assignment_One_Scene = window.classes.Assignment_One_Scene = Assignment_One_Scene;