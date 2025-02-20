class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}


// for boundary and range 
class Rect{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point){
        if(point.x >= this.x - this.width && 
            point.x < this.x + this.width && 
            point.y >= this.y - this.height && 
            point.y < this.y + this.height){
                return true;
            } else {
                return false;
                }
    }

    intersect(boundary) {
        return !(
            boundary.x - boundary.width > this.x + this.width ||
            boundary.x + boundary.width < this.x - this.width ||
            boundary.y - boundary.height > this.y + this.height ||
            boundary.y + boundary.height < this.y - this.height
        );
    }
    

}

class Quadtree{
    constructor(boundary , capacity){
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;  
        }
        
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }
        else{
            if(!this.divided){
                this.subdivide();
            }
            if(this.ne.insert(point)){
                return true;
            }
            else if(this.nw.insert(point)){
                return true;
            }
            else if(this.sw.insert(point)){
                return true;
            }
            else if(this.se.insert(point)){
                return true;
            }
        }
        return false;
    }
    

    clearQuadtree() {
        this.points = [];
        this.divided = false;
        this.ne = null;
        this.nw = null;
        this.se = null;
        this.sw = null;
    }
    

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.width / 2;
        let h = this.boundary.height / 2;
    
        let ne_boundary = new Rect(x + w, y - h, w, h);
        this.ne = new Quadtree(ne_boundary, this.capacity);
    
        let nw_boundary = new Rect(x - w, y - h, w, h);
        this.nw = new Quadtree(nw_boundary, this.capacity);
    
        let se_boundary = new Rect(x + w, y + h, w, h);
        this.se = new Quadtree(se_boundary, this.capacity);
    
        let sw_boundary = new Rect(x - w, y + h, w, h);
        this.sw = new Quadtree(sw_boundary, this.capacity);
    
        this.divided = true;
    }
    
    // finding point in particular range
    query(range, found){
        if(!range.intersect(this.boundary)){
            return;
        }else{
            for(let i=0; i<this.points.length; i++){
                if(range.contains(this.points[i])){
                    found.push(this.points[i]);
                }
            }
            if(this.divided){
                this.ne.query(range, found);
                this.nw.query(range, found);
                this.se.query(range, found);
                this.sw.query(range, found);
            }
        }
    }

    display() {
        noFill();
        stroke(0);
        //rectMode(CENTER);
        rect(this.boundary.x - this.boundary.width, 
             this.boundary.y - this.boundary.height, 
             this.boundary.width * 2, 
             this.boundary.height * 2);
    
        // Draw all points in the quadtree
        fill(0);
        for (let p of this.points) {
            ellipse(p.x, p.y, 2, 2);
        }

        if(this.divided){
            this.ne.display();
            this.nw.display();
            this.se.display();
            this.sw.display();
        }
    }
    
}