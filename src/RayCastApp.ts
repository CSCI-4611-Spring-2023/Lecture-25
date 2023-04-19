/* Lecture 25
 * CSCI 4611, Spring 2023, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { GUI } from 'dat.gui'


export class RayCastApp extends gfx.GfxApp
{
    private cameraControls: gfx.FirstPersonControls;

    private pickMesh: gfx.Mesh;

    private boundsMesh: gfx.MeshInstance;
    private boundsMaterial: gfx.BoundingVolumeMaterial;

    private boundingVolumeMode: string;
    private raycastMode: string;

    constructor()
    {
        super();

        this.cameraControls = new gfx.FirstPersonControls(this.camera); 
        
        this.pickMesh = gfx.ObjLoader.load('./assets/bunny.obj');

        this.boundsMesh = new gfx.MeshInstance(this.pickMesh);
        this.boundsMaterial = new gfx.BoundingVolumeMaterial();

        this.boundingVolumeMode = 'None';
        this.raycastMode = 'Box';
    }

    createScene(): void 
    {
        // Setup camera
        this.camera.setPerspectiveCamera(60, 1920/1080, .1, 750);
        this.camera.position.set(0, 1.5, 2);

        // Configure camera controls
        this.cameraControls.mouseButton = 2;
        this.cameraControls.translationSpeed = 2;

        // Create the scene lighting
        const sceneLight = new gfx.PointLight();
        sceneLight.ambientIntensity.set(0.25, 0.25, 0.25);
        sceneLight.diffuseIntensity.set(1, 1, 1);
        sceneLight.specularIntensity.set(1, 1, 1);
        sceneLight.position.set(10, 10, 10);
        this.scene.add(sceneLight);

        // Create the skybox material
        const skyboxMaterial = new gfx.UnlitMaterial();
        skyboxMaterial.color.set(0.749, 0.918, 0.988);
        skyboxMaterial.side = gfx.Side.BACK;

        // Add the skybox to the scene
        const skybox = gfx.MeshFactory.createBox(500, 500, 500);
        skybox.material = skyboxMaterial;
        this.scene.add(skybox);

        // Create the ground material
        const groundMaterial = new gfx.UnlitMaterial();
        groundMaterial.color.set(0, 0.5, 0);

        // Add the ground mesh to the scene
        const ground = gfx.MeshFactory.createBox(500, 10, 500);
        ground.position.set(0, -5, 0);
        ground.material = groundMaterial;
        this.scene.add(ground);

        this.pickMesh.position.set(0, 1.5, 0);
        this.pickMesh.material.setColor(new gfx.Color(1, 0, 0));
        this.scene.add(this.pickMesh);

        this.boundsMesh.material = this.boundsMaterial;
        this.boundsMesh.visible = false;
        this.scene.add(this.boundsMesh);

        this.createGUI();
    }

    createGUI(): void
    {
        // Create the GUI
        const gui = new GUI();
        gui.width = 200;

        const boundingVolumeController = gui.add(this, 'boundingVolumeMode', [
            'None',
            'Box',
            'Sphere'
        ]);
        boundingVolumeController.name('Bounds');
        boundingVolumeController.onChange(()=>{
            if(this.boundingVolumeMode == 'Box')
            {
                this.boundsMaterial.mode = gfx.BoundingVolumeMode.ORIENTED_BOUNDING_BOX;
                this.boundsMesh.visible = true;
            }
            else if(this.boundingVolumeMode == 'Sphere')
            {
                this.boundsMaterial.mode = gfx.BoundingVolumeMode.BOUNDING_SPHERE;
                this.boundsMesh.visible = true;
            }
            else
            {
                this.boundsMesh.visible = false;
            }
        });

        const raycastController = gui.add(this, 'raycastMode', [
            'Box',
            'Sphere',
            'Mesh'
        ]);
        raycastController.name('Raycast');
    }


    update(deltaTime: number): void 
    {
        this.cameraControls.update(deltaTime);
    }

    onMouseDown(event: MouseEvent): void 
    {
        // Exit the event handler if we did not click the left mouse button
        if(event.button != 0)
            return;

        
    }
}