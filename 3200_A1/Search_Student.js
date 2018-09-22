// Search_Student.js
// Computer Science 3200 - Assignment 1
// Author(s): David Churchill, Trei Solis, Scott Jennings


// CURRENT PROBELMS:
// TODO: We need way to check if node has already been visited.

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

    self.startType = -1;

    self.visitedDict = new Object();

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
        // Check that tile types match
        if (self.grid.isOOB(x, y, 1)) { return false; }
        if (self.grid.get(x, y) != self.startType) { return false; }
        if (self.visitedDict[[x, y]] !== undefined) { return false; }
        return true;
    }

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

        self.path = [];             // set an empty path
        self.open = [];
        self.closed = [];

        self.visitedDict = new Object();

        // Here we set the start node. This has no tile type restrictions
        self.startType = self.grid.get(sx, sy);
        let startNode = NodeX(sx, sy, [0, 0], null)

        self.goalType = self.grid.get(gx, gy);

        // Do not set the goal if its not the same tile type as start
        // TODO: There might be a better way to do this but right now
        //       this has the same behaviour as solution.
        if (self.grid.get(gx, gy) == self.startType)
        {
            self.gx = gx;
            self.gy = gy;
        }

        self.open.push(startNode);
        self.visitedDict[[sx, sy]] = true;
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

        // if we've already finished the search, do nothing
        if (!self.inProgress) { return; }

        if (self.startType != self.goalType)
        {
            self.inProgress = false;
            self.open = [];
            self.closed = [];
            self.path = [];
            self.cost = -1;
            return;
        }

        // Did not find a path
        if (self.open.length == 0) {
            self.inProgress = false;
            self.open = [];
            self.closed = [];
            self.path = [];
            self.cost = -1;
            return;
        }

        // get current node from queue
        var node = self.open.shift();

        // Check if we found the goal node
        if (node.x == self.gx && node.y == self.gy) {
            var parents = [];
            parents.push(node);

            var p = node.parent;
            while (p != null) {
                parents.push(p);
                p = p.parent;
            }

            // Since self.path is in reference to the start node we
            // simply start from the start node here and retrace the path.
            var x = 0;
            var y = 0;
            for (var i = parents.length - 1; i > 0; i--) {
                x = parents[i].action[0];
                y = parents[i].action[1];

                self.path.push([x, y]);
            }
            self.cost = self.path.length * 100;

            self.inProgress = false;
            return;
        }

        // Expand
        var adjNode = null;
        var newX = 0;
        var newY = 0;
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                // Skip middle
                if (x == 0 && y == 0 || x != 0 && y != 0) { continue;}

                newX = node.x + x;
                newY = node.y + y;

                if (self.isLegalAction(newX, newY, [x, y]))
                {
                    adjNode = NodeX(newX, newY, [x, y], node);
                    self.visitedDict[[newX, newY]] = true;
                    self.open.push(adjNode);
                }
            }
        }
        self.closed.push([node.x, node.y]);
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
        let arr = [];
        for (var i = 0; i < self.open.length; i++)
        {
            arr.push([self.open[i].x, self.open[i].y]);
        }
        return arr;
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
        let arr = [];
        for (var i = 0; i < self.closed.length; i++)
        {
            arr.push([self.closed[i][0], self.closed[i][1]]);
        }
        return arr;
    }

    return self;
}

// The Node class to be used in your search algorithm.
// This should not need to be modified to complete the assignment

NodeX = function(x, y, action, parent) {
    self = {};
    self.x = x;
    self.y = y;
    self.action = action;
    self.parent = parent;
    return self;
}
