ngapp.service('contextMenuService', function() {
    this.buildMenuItems = function(scope, items) {
        let menuItems = [];
        items.forEach(function(item) {
            if (!item.visible(scope, menuItems)) return;
            if (typeof item.build === 'function') {
                item.build(scope, menuItems);
            } else {
                item.build.forEach((fn) => fn(scope, menuItems));
            }
        });
        return menuItems;
    };
});