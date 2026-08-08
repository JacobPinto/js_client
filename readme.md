### A test to build a JS client.

Some layout details:

![typical layout](share/layout.png)

1. merge the server_branch with the master branch. --- me
2. Workdir is the folder which should always exists
  a. Each user must see a tree-view of everything underneath the workdir folder
3. After the user creates the simulation he should see the input.json in the tree-view
4. After solution end the user must see the out files in the tree-view.

|-Lbm
| - Solver1
  | - input.json
  | - solution.json
  - Solver2
   
5. Deletion of resources (memory of workdir/Lbm/1 etc.) is important. Thus, when a delete of the solver is requested, these resources must be freed up.

6. Since most server operation are asynchronous, there must be a way for the client to find the state of the async operations. This is needed to update the tree-view as well as to monitor the 
operations (in case of crash). This can be done by a polling mechanism where the client will repeatedly poll the server to query the status of active programs. ---


git checkout -b branch_muziba origin/master
git checkout -b branch_jacob origin/master