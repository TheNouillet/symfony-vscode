export class PromiseUtils {
    /**
     * Taken from https://stackoverflow.com/questions/38385419/throttle-amount-of-promises-open-at-a-given-time
    * Performs a list of callable actions (promise factories) so that only a limited
    * number of promises are pending at any given time.
    *
    * @param listOfCallableActions An array of callable functions, which should
    *     return promises.
    * @param limit The maximum number of promises to have pending at once.
    * @returns A Promise that resolves to the full list of values when everything is done.
    */
   static throttleActions(listOfCallableActions, limit): Promise<any> {
     // We'll need to store which is the next promise in the list.
     let i = 0;
     let resultArray = new Array(listOfCallableActions.length);
   
     // Now define what happens when any of the actions completes. Javascript is
     // (mostly) single-threaded, so only one completion handler will call at a
     // given time. Because we return doNextAction, the Promise chain continues as
     // long as there's an action left in the list.
     function doNextAction() {
       if (i < listOfCallableActions.length) {
         // Save the current value of i, so we can put the result in the right place
         let actionIndex = i++;
         let nextAction = listOfCallableActions[actionIndex];
         return Promise.resolve(nextAction())
             .then(result => {  // Save results to the correct array index.
                resultArray[actionIndex] = result;
                return;
             }).then(doNextAction);
       }
     }
   
     // Now start up the original <limit> number of promises.
     // i advances in calls to doNextAction.
     let listOfPromises = [];
     while (i < limit && i < listOfCallableActions.length) {
       listOfPromises.push(doNextAction());
     }
     return Promise.all(listOfPromises).then(() => resultArray);
   }
}