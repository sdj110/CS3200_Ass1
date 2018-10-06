// Search_Student.js
// Computer Science 3200 - Assignment 2
// Author(s): David Churchill [replace with your name(s)]
//
// All of your Assignment code should be in this file, it is the only file submitted.
// You may create additional functions / member variables within this class, but do not
// rename any of the existing variables or function names, since they are used by the
// GUI to perform specific functions.
//
// Recommended order of completing the assignment:
// 1. Construct a function which computes whether a given size agent can fit in given x,y
//    This will be used by computeSectors / isLegalAction
// 2. Complete the computeSectors algorithm using 4D BFS as shown in class slides
// 3. Use results of step 2 to complete the isConnected function, test it with GUI
// 4. Complete the isLegalAction function, which will be used by searchIteration
// 5. Complete the startSearch function, which is called before searchIteration
// 6. Complete the getOpen and getClosed functions, which will help you visualize / debug
// 7. Complete searchIteration using A* with a heuristic of zero. It should behave like UCS.
// 8. Implement estimateCost heuristic functions, and use it with A*
//
// Please remove these comments before submitting. If you did not get any of the
// functionality of the assignment to work properly, please explain here in a comment.



// NOTE: When trying to computer sector for lower right side of screen we are getting
//      some strange TypeError. Most sectors are being computed correctly but I will continue
//      working on this problem tomorrow.




Search_Student = function (grid, config) {
    var self = {};

    self.config = config;       // search configuration object
                                //   config.actions = array of legal [x, y] actions
                                //   config.actionCosts[i] = cost of config.actions[i]
                                //   config.heuristic = 'diag', 'card', 'dist', or 'zero'
    self.grid = grid;           // the grid we are using to search
    self.sx = -1;               // x location of the start state
    self.sy = -1;               // y location of the start state
    self.gx = -1;               // x location of the goal state
    self.gy = -1;               // y location of the goal state
    self.size = 1;              // the square side length (size) of the agent
    self.maxSize = 3;           // the maximum size of an agent

    self.inProgress = false;    // whether the search is in progress

    self.path = [];             // the path, if the search found one
    self.open = [];             // the current open list of the search (stores Nodes)
    self.closed = [];           // the current closed list of the search
    self.cost = 'Search Not Completed'; // the cost of the path found, -1 if no path

    self.sectors = new Object(); // our sector dictionary

    // Student TODO: Implement this function
    //
    // This function should set up all the necessary data structures to begin a new search
    // This includes, but is not limited to: setting the start and goal locations, resetting
    // the open and closed lists, and resetting the path. I have provided a starting point,
    // but it is not complete.
    //
    // Please note that this is NOT the place to do your connected sector computations. That
    // should be done ONCE upon object creation in the computeSectors function below.
    //
    // Args:
    //    sx, sy (int,int) : (x,y) position of the start state
    //    gx, gy (int,int) : (x,y) position of the goal state
    //    size   (int)     : the size of the agent for this search episode
    //
    // Returns:
    //    none             : this function does not return anything
    //
    self.startSearch = function(sx, sy, gx, gy, size) {
        // deals with an edge-case with the GUI, leave this line here
        if (sx == -1 || gx == -1) { return; }

        self.inProgress = true;     // the search is now considered started
        self.sx = sx;               // set the x,y location of the start state
        self.sy = sy;
        self.gx = gx;               // set the x,y location of the goal state
        self.gy = gy;
        self.size = size;           // the size of the agent
        self.path = [];             // set an empty path

        // TODO: everything else necessary to start a new search
    }

    // Student TODO: Implement this function
    //
    // This function should compute and return the heuristic function h(n) of a given
    // start location to a given goal location. This function should return one of
    // four different values, based on the self.config.heuristic option
    //
    // Args:
    //    x, y   (int,int) : (x,y) location of the given position
    //    gx, gy (int,int) : (x,y) location of the goal
    //    size             : the square side length size of the agent
    //
    // Returns:
    //    int              : the computed distance heuristic
    self.estimateCost = function (x, y, gx, gy) {
        // compute and return the diagonal manhattan distance heuristic
        if (self.config.heuristic == 'diag') {
            return 3;
        // compute and return the 4 directional (cardinal) manhattan distance
        } else if (self.config.heuristic == 'card') {
            return 2;
        // compute and return the 2D euclidian distance (Pythagorus)
        } else if (self.config.heuristic == 'dist') {
            return 1;
        // return zero heuristic
        } else if (self.config.heuristic == 'zero') {
            return 0;
        }
    }

    // Student TODO: Implement this function
    //
    // This function should return whether or not the two given locations are connected.
    // Two locations are connected if a path is possible between them. For this assignment,
    // keep in mine that 4D connectedness is equivalent to 8D connectedness because you
    // cannot use a diagonal move to jump over a tile.
    //
    // Args:
    //    x1, y1 (int,int) : (x,y) location 1
    //    x2, y2 (int,int) : (x,y) location 2
    //    size             : the square side length size of the agent
    //
    // Returns:
    //    bool              : whether the two locations are connected
    self.isConnected = function (x1, y1, x2, y2, size) {
        return self.sectors[size][self.stringify([x1, y1])] == self.sectors[size][self.stringify([x2, y2])]
    }

    // Student TODO: Implement this function
    //
    // This function should compute and return whether or not the given action is able
    // to be performed from the given (x,y) location.
    //
    // Diagonal moves are only legal if both 2-step cardinal moves are also legal.
    // For example: Moving diagonal up-right is only legal if you can move both up
    //              then right, as well as right then up.
    //
    // Args:
    //    x, y   (int,int) : (x,y) location of the given position
    //    size             : the square side length size of the agent
    //    action [int,int] : the action to be performed, representing the [x,y] movement
    //                       from this position. for example: [1,0] is move 1 in the x
    //                       direction and 0 in the y direction (move right).
    //
    // Returns:
    //    bool : whether or not the given action is legal at the given location
    self.isLegalAction = function (x, y, size, action) {
        if (self.checkOOB(x + action[0], y + action[1])) {
            return false;
        }
        if (!self.tilesMatch(x, y, x + action[0], y + action[1])) {
            return false;
        }
        return true;
    }

    // Student TODO: Implement this function
    //
    // This function should compute and store the connected sectors discussed in class.
    // This function is called by the construct of this object before it is returned.
    //
    // Args:
    //    none
    //
    // Returns:
    //    none
    self.computeSectors = function() {

        var size = 1;
        var sector = 1;
        self.sectors[size] = new Object();


        // TODO: HERE WTF IS GOING ON. Certain values for x and y result in TypeError
        // Try making y bigger or smaller and see!!!!
        //sector = self.generateSector(0, 0, 1, sector);
        sector = self.generateSector(0, 0, 1, sector);
        sector = self.generateSector(0, 22, 1, sector);
        sector = self.generateSector(16, 32, 1, sector);
        sector = self.generateSector(18, 17, 1, sector);
        sector = self.generateSector(9, 54, 1, sector);
        sector = self.generateSector(40, 40, 1, sector);
        sector = self.generateSector(55, 3, 1, sector);
        sector = self.generateSector(9, 7, 1, sector);
        sector = self.generateSector(31, 39, 1, sector);
        sector = self.generateSector(40, 26, 1, sector);
        sector = self.generateSector(61, 62, 1, sector);




        //sector = self.generateSector(14, 10, 1, sector);





        for (let y = 0; y < self.grid.height; y++) {
            for (let x = 0; x < self.grid.width; x++) {
                if (self.sectors[size][self.stringify([x, y])] !== undefined) { continue; }

                //console.log("Generate Sector around [" + x + "," + y + "]")
                //sector = self.generateSector(x, y, size, sector);
            }
        }
    }

    self.generateSector = function(x, y, size, sector) {
        var sectorList = self.BFS(x, y, size);

        for (let i = 0; i < sectorList.length; i++) {
            self.sectors[size][self.stringify(sectorList[i])] = sector;
        }

        console.log("SECTOR: " + sector + "   SIZE: " + sectorList.length);
        for (let i = 0; i < sectorList.length; i++) {
            //console.log(self.stringify(sectorList[i]));
        }

        sector += 1;
        return sector;
    }

    self.BFS = function(sx, sy, size) {

        var openList = [];
        var closedList = [];
        var startNode = [sx, sy];
        var startType = self.tileType(sx, sy);
        var visited = new Object();

        openList.push(startNode);
        visited[self.stringify(startNode)] = true;

        while (openList.length > 0) {
            let node = openList.shift();
            // iterate through actions
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if (x == 0 && y == 0 || x != 0 && y != 0) { continue;}
                    if (visited[self.stringify([node[0] + x, node[1] + y])]) { continue; }

                    if (self.isLegalAction(node[0], node[1], size, [x, y])) {
                        var adjNode = [node[0] + x, node[1] + y];
                        visited[self.stringify(adjNode)] = true;
                        openList.push(adjNode);
                    }
                }
            }
            closedList.push(node);
        }
        return closedList;
    }

    self.stringify = function (obj) {
        return JSON.stringify(obj);
    }

    self.tileType = function (x, y) {
        return self.grid.get(x, y);
    }

    self.tilesMatch = function (x1, y1, x2, y2) {
        return self.tileType(x1, y1) == self.tileType(x2, y2);
    }

    self.checkOOB = function (x, y, size) {
        return self.grid.isOOB(x, y, size);
    }

    // Student TODO: Implement this function
    //
    // This function performs one iteration of search, which is equivalent to everything
    // inside the while (true) part of the algorithm pseudocode in the class nodes. The
    // only difference being that when a path is found, we set the internal path variable
    // rather than return it from the function. When expanding the current node, you must
    // use the self.isLegalAction function above.
    //
    // If the search has been completed (path found, or open list empty) then this function
    // should do nothing until the startSearch function has been called again. This function
    // should correctly set the self.inProgress variable to false once the search has been
    // completed, which is required for the GUI to function correctly.
    //
    // This function should perform one the A* search algorithm using Graph-Search
    // The algorithm is located in the Lecture 6 Slides
    //
    // Tip: You can use the included BinaryHeap object as your open list data structure
    //      You may also use a simple array and search for it for the minimum f-value
    //
    // Args:
    //    none
    //
    // Returns:
    //    none
    //
    self.searchIteration = function() {

        // if we've already finished the search, do nothing
        if (!self.inProgress) { return; }

        // we can do a quick check to see if the start and end goals are connected
        // if they aren't, then we can end the search before it starts
        // don't bother searching if the start and end points don't have the same type
        // this code should remain for your assignment
        if (!self.isConnected(self.sx, self.sy, self.gx, self.gy, self.objectSize)) {
            self.inProgress = false; // we don't need to search any more
            self.cost = -1; // no path was possible, so the cost is -1
            return;
        }

        // Example: For simple demonstration, compute an L-shaped path to the goal
        // This is just so the GUI shows something when Student code is initially selected
        // Completely delete all of the following code in this function to write your solution
        var dx = (self.gx - self.sx) > 0 ? 1 : -1;
        var dy = (self.gy - self.sy) > 0 ? 1 : -1;
        for (var x=0; x < Math.abs(self.gx-self.sx); x++) { self.path.push([dx, 0]); }
        for (var y=0; y < Math.abs(self.gy-self.sy); y++) { self.path.push([0, dy]); }

        // we found a path, so set inProgress to false
        self.inProgress = false;

        // set the cost of the path that we found
        // our sample L-shaped path cost is its length * 100
        self.cost = self.path.length * 100;

        // if the search ended and no path was found, set self.cost = -1
    }

    // Student TODO: Implement this function
    //
    // This function returns the current open list states in a given format. This exists as
    // a separate function because your open list used in search will store nodes
    // instead of states, and may have a custom data structure that is not an array.
    //
    // Args:
    //    none
    //
    // Returns:
    //    openList : an array of unique [x, y] states that are currently on the open list
    //
    self.getOpen = function() {
        return [];
    }

    // Student TODO: Implement this function
    //
    // This function returns the current closed list in a given format. This exists as
    // a separate function, since your closed list used in search may have a custom
    // data structure that is not an array.
    //
    // Args:
    //    none
    //
    // Returns:
    //    closedList : an array of unique [x, y] states that are currently on the closed list
    //
    self.getClosed = function() {
        return [];
    }

    self.computeSectors();
    return self;
}
