// Search_Student.js 
// Computer Science 3200 - Assignment 1
// Author(s): David Churchill [replace with your name(s)]
//
// All of your Assignment 1 code should be in this file, it is the only file submitted
// You may create additional functions / member variables within this class, but do not
// rename any of the existing variables or function names, since they are used by the
// GUI to perform specific functions.
Search_Student = function (grid, config) {
    var self = {};

    self.config = config;       // search configuration object
                                //   config.actions = array of legal [x, y] actions
                                //   config.actionCosts[i] = cost of config.actions[i]
                                //   config.strategy = 'bfs' or 'dfs'

    self.grid = grid;           // the grid we are using to search
    self.sx = -1;               // x location of the start state
    self.sy = -1;               // y location of the start state
    self.gx = -1;               // x location of the goal state
    self.gy = -1;               // y location of the goal state
    self.cost = 0;

    self.inProgress = false;     // whether the search is in progress
    self.strategy = 'bfs';      // the strategy used to do the search

    self.path = [];             // the path, if the search found one
    self.open = [];             // the current open list of the search (stores Nodes)
    self.closed = [];           // the current closed list of the search
    
    // Student TODO: Implement this function
    //
    // This function should set up all the necessary data structures to begin a new search
    // This includes, but is not limited to: setting the start and goal locations, resetting
    // the open and closed lists, and resetting the path. I have provided a starting point,
    // but it is not complete.
    //
    // Args:
    //    sx, sy (int,int) : (x,y) position of the start state
    //    gx, gy (int,int) : (x,y) position of the goal state
    //    method           : the search method to be used ('dfs' or 'bfs')
    //
    // Returns:
    //    none             : this function does not return anything
    //
    self.startSearch = function(sx, sy, gx, gy) {
        self.inProgress = true;     // the search is now considered started
        self.sx = sx;               // set the x,y location of the start state
        self.sy = sy;
        self.gx = gx;               // set the x,y location of the goal state
        self.gy = gy;
        self.path = [];             // set an empty path

        // TODO: everything else necessary to start a new search
    }

    // Student TODO: Implement this function
    //
    // This function should compute and return whether or not the given action is able
    // to be performed from the given (x,y) location
    //
    // Args:
    //    x, y   (int,int) : (x,y) location of the given position
    //    action [int,int] : the action to be performed, representing the [x,y] movement
    //                       from this position. for example: [1,0] is move 1 in the x
    //                       direction and 0 in the y direction (move right). For this
    //                       assignment, the only action possibilities should be:
    //                       [1,0], [0,1], [-1,0], [0,-1] 
    //
    // Returns:
    //    bool : whether or not the given action is legal at the given location
    self.isLegalAction = function (x, y, action) {
        return true;
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
    // This function should perform one iteration of breadth-first search (BFS) if the
    // self.config.strategy variable == 'bfs', or one iteration of depth-first search (DFS) if
    // the self.config.strategy variable == 'dfs'. There should be a few line(s) of code difference
    // between the two algorithms.
    //
    // Tip: You can use a JavaScript array to represent a queue or a stack. 
    //      Array.push(e) pushes an element onto the end of the array. 
    //      You can use Array.pop() to return and remove the last element of the array, simulating a stack. 
    //      You can use Array.shift() to return and remove the first element of the array, simulating a queue
    //      You may also use your own custom data structure(s) if you wish.
    //
    // Args:
    //    none
    //
    // Returns:
    //    none
    //
    self.searchIteration = function() {
        // Example: For simple demonstration, compute an L-shaped path to the goal
        // This is just so the GUI shows something when Student code is initially selected
        // Completely delete all of the code in this function to write your solution

        // if we've already finished the search, do nothing
        if (!self.inProgress) { return; }

        // compute an L-shaped path in a single step (you must replace this)
        var dx = (self.gx - self.sx) > 0 ? 1 : -1;
        var dy = (self.gy - self.sy) > 0 ? 1 : -1;
        for (var x=0; x < Math.abs(self.gx-self.sx); x++) { self.path.push([dx, 0]); }
        for (var y=0; y < Math.abs(self.gy-self.sy); y++) { self.path.push([0, dy]); }
        
        // the cost of the path for this assignment is the path length * 100
        // since all action costs are equal to 100 (4-directional movement)
        self.cost = self.path.length * 100;

        // we found a path, so set inProgress to false
        self.inProgress = false;
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

    return self;
}

// The Node class to be used in your search algorithm.
// This should not need to be modified to complete the assignment
Node = function(x, y, action, parent) {
    self = {};
    self.x = x;
    self.y = y;
    self.action = action;
    self.parent = parent;
    return self;    
}