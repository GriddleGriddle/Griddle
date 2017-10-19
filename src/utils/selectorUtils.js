import { forOwn, size, values } from 'lodash';
import { createSelector } from 'reselect'

const DEP = "D";
const FUNC = "F";

const globalSelectors = {};

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
const griddleCreateSelector = (...args) => {

  // All selectors that use createSelector must have a minimum of one
  // dependency and the selector function itself
  if (args.length < 2) {
    throw new Error("Cannot create a selector with fewer than 2 arguments, must have at least one dependency and the selector function");
  }

  // The first n - 1 args are the dependencies, they must
  // all be strings.
  //const dependencies = args.slice(0, args.length - 1);


  // The first n - 1 args are selector functions AND/OR
  // selector dependencies.
  //
  // If all arguments are selector functions, this would be
  // considered a 'legacy' style hard-coded createSelector
  // invocation. We can immediately delegate to createSelector
  // and return the selector function.
  //
  // If all of the arguments are selector dependencies --
  // which are strings naming the to-be-resolved selector functions --
  // then we need to return a selector generator function. This will
  // later be provided with a list of fully resolved selector
  // functions that can then be used to generate this selector
  // using createSelector.
  //
  // If there is a MIXTURE of both selector functions and
  // selector dependency strings, then we still need a
  // selector generator but only a portion of the functions
  // need to be resolved for later. We save the provided selector
  // functions and will merge them with the resolved selectors
  // when the generator function is called. This could be used
  // to force a particular dependency from being overridden.
  // This should be considered an advanced feature, you should
  // only prevent dependent selector overriding if there is a
  // very good reason for it.
  //
  // As this griddleCreateSelector function can return either the
  // output of reselect's 'createSelector', or a selector generator
  // function, the distinguishing feature will be that the selector
  // generator will have as a prop the .dependencies field which
  // is a list of the string names of the dependencies for this
  // generator. If this is a mixed type generator, the length of
  // the dependencies will be smaller than args.length - 1 based
  // on how many selector function args were provided.
  const depsOrFuncs = args.slice(0, args.length - 1);
  const dofTypeMap = [];
  const dependencies = {};
  const functions = {};
  for (const index in depsOrFuncs) {
    const depOrFunc = depsOrFuncs[index];
    switch(typeof depOrFunc) {
      case "function": 
        dofTypeMap[index] = FUNC;
        functions[index] = depOrFunc;
        break;
      case "string":
        dofTypeMap[index] = DEP;
        dependencies[index] = depOrFunc;
        break;
      default:
        throw new Error("The first n - 1 arguments of griddleCreateSelector must be either strings or functions");
    }
  }

  // The last of n args is the selector function,
  // it must be a function
  const selector = args[args.length - 1];
  if (typeof selector !== "function") {
    throw new Error("Last argument must be a function");
  }

  // If there are a number of function arguments equal to the
  // first n - 1 arguments, this is a fully hard coded selector,
  // call createSelector and return.
  if (size(functions) === args.length - 1) {
    return createSelector(...args);
  }

  // Otherwise, this is either a mixed or fully string dependency
  // selector. Create a selector generator.

  //const selectorGeneratorWrapper = (() => {

  return (() => {

    const createSelectorFuncs = new Map();
    const ownSelector = selector;

    const factory = (resolvedSelectors = {}) => {
      const selectors = [];
      if (!createSelectorFuncs.size) {
        for (const index in dofTypeMap) {
          const dofType = dofTypeMap[index];
          switch(dofType) {
            case FUNC:
              //createSelectorFuncs.push(functions[index]);
              createSelectorFuncs.set(index, functions[index]);
              break;
            case DEP:
              if (resolvedSelectors.hasOwnProperty(dependencies[index])) {
                //createSelectorFuncs.push(resolvedSelectors[dependencies[index]]);
                createSelectorFuncs.set(dependencies[index], resolvedSelectors[dependencies[index]]);
              } else {
                throw new Error(`Dependency ${dependencies[index]} not found!`);
              }
              break;
          }
        }
        createSelectorFuncs.forEach((func) => selectors.push(func));
        selectors.push(ownSelector);
      } else {
        createSelectorFuncs.forEach((func, key) => {
          if (resolvedSelectors.hasOwnProperty(key)) {
            selectors.push(resolvedSelectors[key]);
          } else {
            selectors.push(func);
          }
        });
        selectors.push(ownSelector);
      }

      return createSelector(...selectors);
    };

    const selectorGenerator = (...args) => {
      if (!selectorGenerator.generatedSelector) {
        const resolvedSelectors = args[0];

        //const createSelectorFuncs = [];
        //for (const index in dofTypeMap) {
        //  const dofType = dofTypeMap[index];
        //  switch(dofType) {
        //    case FUNC:
        //      createSelectorFuncs.push(functions[index]);
        //      break;
        //    case DEP:
        //      if (resolvedSelectors.hasOwnProperty(dependencies[index])) {
        //        createSelectorFuncs.push(resolvedSelectors[dependencies[index]]);
        //      } else {
        //        throw new Error(`Dependency ${dependencies[index]} not found!`);
        //      }
        //      break;
        //  }
        //}

        //// add this selector
        //createSelectorFuncs.push(selector);

        // call createSelector with the final list of args
        //selectorGenerator.generatedSelector = createSelector(...createSelectorFuncs);
        selectorGenerator.generatedSelector = factory(resolvedSelectors);
        //selectorGenerator.generated = true;

        // can probably just return this, as calls to this function
        // will now flow into just calling the generated selector function
        return selectorGenerator;

        // Selector was called directly in legacy code
        //return createSelector(...createSelectorFuncs)(selectors);
      } else {
        return selectorGenerator.generatedSelector(...args)
      }
    }
    selectorGenerator.createSelectorFuncs = createSelectorFuncs;
    selectorGenerator.ownSelector = ownSelector;
    selectorGenerator.factory = factory;
    selectorGenerator.generatedSelector = undefined;
    selectorGenerator.dependencies = values(dependencies);
    return selectorGenerator;
  })();

  // attach the list of string dependencies to the
  // selector generator
  //selectorGeneratorWrapper.dependencies = values(dependencies);
  //return selectorGeneratorWrapper;
};
export { griddleCreateSelector as createSelector };


export const composeSelectors = (plugins) => {

  // STEP 1
  // ==========
  //
  // Add all selectors to the list of combined selectors.
  // 
  // Each key in combinedSelectors corresponds to
  // an array of selectors that were encountered for that given name.
  // A newer selector that is encountered for a given name is unshifted
  // onto index 0 of the array such at all index 0's of each array
  // are the most 'recently' encountered selector for that name. This allows
  // use to keep track of all the places these selectors were declared so
  // that when finally building the selectors we can go back to these
  // references and set them correctly. This specifically allows for the
  // overriding functionality to work properly with 'hard' import references
  // to selectors.
  //
  // Each encountered selector function is wrapped in an object which is used
  // to keep track of all the data needed to properly build all the
  // selector dependency trees
  const combinedSelectors = new Map();

  plugins.forEach((plugin) => {
    console.log('Begin parsing selectors for plugin');
    forOwn(plugin.selectors, (selector, name) => {
      if (!combinedSelectors.has(name)) {
        console.log(`  First instance of selector ${name} encountered`);
        combinedSelectors.set(name, [{
          name,
          selector,
          dependencies: selector.dependencies || [],
          rank: 0,
          traversed: false
        }]);
      } else {
        console.log(`  Overriding existing selector named ${name}`);
        combinedSelectors.get(name).unshift({
          name,
          selector,
          dependencies: selector.dependencies || [],
          rank: 0,
          traversed: false
        });
      }
    });
  });

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
          //if (typeof dependency === 'function') continue;
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
          const childsDependencies = getDependencies(combinedSelectors.get(dependency)[0], childParents);
          childsDependencies.forEach((key) => flattenedDependencies.add(key))
          const childRank = combinedSelectors.get(dependency)[0].rank;
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
  // Run getDependencies on each first selector in the 'combinedSelectors' list
  // This fills out the 'ranks' list for use in the next step
  for (let e of combinedSelectors) {
    const [name, selectorChain] = e;
    getDependencies(selectorChain[0], new Set([name]));
  }

  // STEP 5
  // ==========
  //
  // Create a flat object of just the actual selector functions
  // This will be used as the set of selectors on context
  const flattenedSelectors = {};
  //console.log({ allSelectors, combinedSelectors, ranks });
  console.log(ranks);
  for (let rank of ranks) {
    for (let selector of rank) {
      //checking if the selector is generated may not be necessary?
      if (selector.dependencies.length && !selector.selector.generatedSelector) {

        const generatedSelector = selector.selector(flattenedSelectors);

        const selectorsOfName = combinedSelectors.get(selector.name);

        selectorsOfName.slice(1, selectorsOfName.length).forEach((selectorOfName) => {
          if (selectorOfName.dependencies.length) {
            selectorOfName.selector.createSelectorFuncs = generatedSelector.createSelectorFuncs;
            selectorOfName.selector.generatedSelector = generatedSelector.generatedSelector;
          }
        });

        flattenedSelectors[selector.name] = generatedSelector;

        //const childSelectors = { _dependencies: true };
        //for (let childSelector of selector.dependencies) {
        //  if (typeof childSelector === 'string') {
        //    childSelectors[childSelector] = combinedSelectors.get(childSelector).selector;
        //  }
        //}
        //flattenedSelectors[selector.name] = selector.selector(childSelectors);
      }
      else {
        flattenedSelectors[selector.name] = selector.selector;
      }
    }
  }

  // Work-around for direct references to composed selectors
  //Object.assign(globalSelectors, flattenedSelectors);

  return flattenedSelectors;
}
