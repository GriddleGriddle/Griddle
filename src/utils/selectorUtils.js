import { forOwn } from 'lodash';
import { createSelector } from 'reselect'

/*
 * Wrapped 'createSelector' that allows for building the selector
 * dependency tree. Takes any number of arguments, all arguments but the
 * last must be dependencies, which are the string names of selectors
 * this selector depends on and the last arg must be the selector function
 * itself. This structure mirrors very closely what calling 'createSelector'
 * looks like.
 *
 * const mySelector = createSelector(
 *   aSelector,
 *   anotherSelector,
 *   (a, b) => (someLogic....)
 * );
 *
 * const mySelector = griddleCreateSelector(
 *   "aSelector",
 *   "anotherSelector",
 *   (a, b) => (someLogic...)
 * );
 *
 * When the selectors are finally generated, the actual dependency selectors
 * are passed to the createSelector function.
 */
export const griddleCreateSelector = (...args) => {

  // All selectors that use createSelector must have a minimum of one
  // dependency and the selector function itself
  if (args.length < 2) {
    throw new Error("Cannot create a selector with fewer than 2 arguments, must have at least one dependency and the selector function");
  }

  // The first n - 1 args are the dependencies, they must
  // all be strings.
  const dependencies = args.slice(0, args.length - 1);
  for (let dependency of dependencies) {
    if (typeof dependency !== "string") {
      throw new Error("Args 0..n-1 must be strings");
    }
  }

  // The last of n args is the selector function,
  // it must be a function
  const selector = args[args.length - 1];
  if (typeof selector !== "function") {
    throw new Error("Last argument must be a function");
  }

  return {
    // the creator function is called to generate the
    // selector function. It is passed the object containing all
    // of the static/generated selector functions to be potentially
    // used as dependencies
    creator: (selectors) => {

      // extract the dependency selectors using the list
      // of dependencies
      const createSelectorFuncs = [];
      for (let dependency of dependencies) {
        createSelectorFuncs.push(selectors[dependency]);
      }

      // add this selector
      createSelectorFuncs.push(selector);

      // call createSelector with the final list of args
      return createSelector(...createSelectorFuncs);
    },

    // the list of dependencies is needed to build the dependency
    // tree
    dependencies
  };
};


export const composeSelectors = (baseSelectors, composedSelectors, plugins) => {

  // STEP 1
  // ==========
  //
  // Add all of the 'base' selectors to the list of combined selectors.
  // The actuall selector functions are wrapped in an object which is used
  // to keep track of all the data needed to properly build all the
  // selector dependency trees
  console.log("Parsing built-in selectors");
  const combinedSelectors = new Map();

  forOwn(baseSelectors, (baseSelector, name) => {
    const selector = {
      name, 
      selector: baseSelector,
      dependencies: [],
      rank: 0,
      traversed: false
    };
    combinedSelectors.set(name, selector);
  });

  // STEP 2
  // ==========
  //
  // Add all of the 'composed' selectors to the list of combined selectors.
  // Composed selectors use the 'createSelector' function provided by reselect
  // and depend on other selectors. These new selectors are located in a 
  // new file named 'composedSelectors' and are now an object that looks like this:
  //   {
  //     creator: ({dependency1, dependency2, ...}) => return createSelector(dependency1, dependency2, (...) => (...)),
  //     dependencies: ["dependency1", "dependency2"]
  //   }
  // 'creator' will return the selector when it is run with the dependency selectors
  // 'dependencies' are the string names of the dependency selectors, these will be used to
  // build the tree of selectors
  forOwn(composedSelectors, (composedSelector, name) => {
    const selector = {
      name,
      ...composedSelector,
      rank: 0,
      traversed: false
    };
    combinedSelectors.has(name) && console.log(`  Overriding existing selector named ${name}`);
    combinedSelectors.set(name, selector);
  });

  // STEP 3
  // ==========
  //
  // Once the built-in 'base' and 'composed' selectors are added to the list,
  // repeat the same process for each of the plugins.
  //
  // Plugins can now redefine a single existing selector without having to
  // include the full list of dependency selectors since the dependencies
  // are now created dynamically
  for (let i in plugins) {
    console.log(`Parsing selectors for plugin ${i}`);
    const plugin = plugins[i];
    forOwn(plugin.selectors, (baseSelector, name) => {
      const selector = {
        name,
        selector: baseSelector,
        dependencies: [],
        rank: 0,
        traversed: false
      };

      // console log for demonstration purposes
      combinedSelectors.has(name) && console.log(`  Overriding existing selector named ${name} with base selector`);
      combinedSelectors.set(name, selector);
    });

    forOwn(plugin.composedSelectors, (composedSelector, name) => {
      const selector = {
        name,
        ...composedSelector,
        rank: 0,
        traversed: false
      };

      // console log for demonstration purposes
      combinedSelectors.has(name) && console.log(`  Overriding existing selector named ${name} with composed selector`);
      combinedSelectors.set(name, selector);
    });
  }


  // RANKS
  // ==========
  //
  // The ranks array is populated when running getDependencies
  // It stores the selectors based on their 'rank'
  // Rank can be defined recursively as:
  // - if a selector has no dependencies, rank is 0
  // - if a selector has 1 or more dependencies, rank is max(all dependency ranks) + 1
  const ranks = [];

  // GET DEPENDENCIES
  // ==========
  //
  // getDependencies recursively descends through the dependencies
  // of a given selector doing several things:
  // - creates a 'flat' list of dependencies for a given selector,
  // which is a list of all of its dependencies
  // - calculates the rank of each selector and fills out the above ranks list
  // - determines if there are any cycles present in the dependency tree
  //
  // It also memoizes the results in the combinedSelectors Map by setting the
  // 'traversed' flag for a given selector. If a selector has been flagged as
  // 'traversed', it simply returns the previously calculated dependencies
  const getDependencies = (node, parents) => {
    // if this node has already been traversed
    // no need to run the get dependencies logic as they
    // have already been computed
    // simply return its list of flattened dependencies
    if (!node.traversed) {

      // if the node has dependencies, add each one to the node's
      // list of flattened dependencies and recursively call
      // getDependencies on each of them
      if (node.dependencies.length > 0) {

        const flattenedDependencies = new Set();
        for (let dependency of node.dependencies) {
          if (!combinedSelectors.has(dependency)) {
            const err = `Selector ${node.name} has dependency ${dependency} but this is not in the list of dependencies! Did you misspell something?`;
            throw new Error(err);
          }

          // if any dependency in the recursion chain
          // matches one of the parents there is a cycle throw an exception
          // this is an unrecoverable runtime error
          if (parents.has(dependency)) {
            let err = "Dependency cycle detected! ";
            for (let e of parents) {
              e === dependency ? err += `[[${e}]] -> ` : err += `${e} -> `;
            }
            err += `[[${dependency}]]`;
            console.log(err);
            throw new Error(err);
          }
          flattenedDependencies.add(dependency);
          const childParents = new Set(parents);
          childParents.add(dependency);
          const childsDependencies = getDependencies(combinedSelectors.get(dependency), childParents);
          childsDependencies.forEach((key) => flattenedDependencies.add(key))
          const childRank = combinedSelectors.get(dependency).rank;
          childRank >= node.rank && (node.rank = childRank + 1);
        }
        node.flattenedDependencies = flattenedDependencies;
        node.traversed = true;

      } else {

        // otherwise, this is a leaf node
        // - set the node's rank to 0
        // - set the nodes flattenedDependencies to an empty set
        node.flattenedDependencies = new Set();
        node.traversed = true;
      }
      ranks[node.rank] || (ranks[node.rank] = new Array());
      ranks[node.rank].push(node);
    }
    return node.flattenedDependencies;
  };


  // STEP 4
  // ==========
  //
  // Run getDependencies on each selector in the 'combinedSelectors' list
  // This fills out the 'ranks' list for use in the next step
  for (let e of combinedSelectors) {
    const [name, selector] = e;
    getDependencies(selector, new Set([name]));
  }

  // STEP 5
  // ==========
  //
  // Create a flat object of just the actual selector functions
  const flattenedSelectors = {};
  for (let rank of ranks) {
    for (let selector of rank) {
      if (selector.creator) {
        const childSelectors = {};
        for (let childSelector of selector.dependencies) {
          childSelectors[childSelector] = combinedSelectors.get(childSelector).selector;
        }
        selector.selector = selector.creator(childSelectors);
      }
      flattenedSelectors[selector.name] = selector.selector;
    }
  }

  return flattenedSelectors;
}
