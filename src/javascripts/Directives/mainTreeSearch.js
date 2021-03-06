ngapp.controller('mainTreeSearchController', function($scope, $q, $timeout, hotkeyService, hotkeyFactory) {
    // helper variables
    let aKey = 65, eKey = 69, fKey = 70, nKey = 78,
        searchOptionKeys = [fKey, eKey, nKey, aKey],
        hotkeys = hotkeyFactory.treeSearchHotkeys();

    // scope variables
    $scope.search = '';
    $scope.searchOptions = { searchBy: "1", exact: true };
    $scope.searchBy = {
        0: "Form ID",
        1: "Editor ID",
        2: "Name"
    };

    // inherited functions
    hotkeyService.buildOnKeyDown($scope, 'onSearchKeyDown', hotkeys);

    // helper functions
    let getElementIndex = function(elements, element) {
        return elements.findIndex(function(e) {
            return xelib.ElementEquals(e, element);
        });
    };

    let getStartIndex = function(files, file, reverse, noOffset) {
        if (file) {
            return getElementIndex(files, file) + noOffset ? 0 : (reverse ? -1 : 1);
        } else {
            return reverse ? files.length : 0;
        }
    };

    let findExactMatch = function(search, reverse = false) {
        let action = $q.defer();
        $timeout(function() {
            let start = Date.now(),
                result = 0,
                currentNode = $scope.lastSelectedNode(),
                currentFile = currentNode && xelib.GetElementFile(currentNode.handle),
                currentNodeIsFile = currentNode && currentNode.element_type === xelib.etFile;
            xelib.WithHandles(xelib.GetElements(0, '', true), function(files) {
                let startIndex = getStartIndex(files, currentFile, reverse, currentNodeIsFile);
                for (let i = startIndex; i >= 0 && i < files.length; reverse ? i-- : i++) {
                    if ($scope.cancelled) return;
                    result = xelib.GetElement(files[i], search, true);
                    if (result) return;
                }
            });
            console.log(`Search completed in ${Date.now() - start}ms`);
            action.resolve(result);
        }, 100);
        return action.promise;
    };

    let findPartialMatch = function(search, byName, reverse) {
        let action = $q.defer();
        $timeout(function() {
            let functionName = `Find${(reverse ? 'Previous' : 'Next')}Record`,
                node = $scope.lastSelectedNode(),
                handle = node ? node.handle : 0,
                result = xelib[functionName](handle, search, !byName, byName, true);
            action.resolve(result);
        }, 100);
        return action.promise;
    };

    let findElement = function(reverse) {
        let byName = $scope.searchOptions.searchBy == 2,
            search = $scope.search;
        // search by FormID is always exact
        if ($scope.searchOptions.exact) {
            // search by FormID uses the same syntax as search by EditorID
            return findExactMatch(byName ? `"${search}"` : search, reverse);
        } else {
            return findPartialMatch(search, byName, reverse);
        }
    };

    // scope functions
    $scope.foundResult = function(handle) {
        if ($scope.handle) xelib.Release($scope.handle);
        $scope.handle = handle;
        $scope.navigateToElement(handle);
    };

    $scope.previousResult = function() {
        $scope.$emit('loading', 'Searching...');
        findElement(true).then(function(handle) {
            $scope.notFound = !handle;
            if (handle) $scope.foundResult(handle);
            $scope.$emit('doneLoading');
        });
    };

    $scope.nextResult = function() {
        $scope.$emit('loading', 'Searching...');
        findElement().then(function(handle) {
            $scope.notFound = !handle;
            if (handle) $scope.foundResult(handle);
            $scope.$emit('doneLoading');
        });
    };

    $scope.closeSearch = function() {
        if ($scope.handle) xelib.Release($scope.handle);
        $scope.toggleSearchBar();
    };

    $scope.blurSearch = function() {
        $scope.notFound = false;
    };

    $scope.toggleExact = function() {
        $scope.searchOptions.exact = !$scope.searchOptions.exact;
    };

    $scope.setSearchBy = function(e) {
        let n = searchOptionKeys.indexOf(e.keyCode);
        if (n == -1) return;
        $scope.searchOptions.searchBy = n.toString();
    };

    // event listeners
    $scope.$on('cancel', () => $scope.cancelled = true);
});