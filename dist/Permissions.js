"use strict";
/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = void 0;
/*
 * Permissions
 * ADMIN - can do everything
 * VIEW_PASSWORD - can view the hashed password
 * VIEW_EMAIL - can view the email
 * VIEW_CREATED_AT - can view the created at date
 * VIEW_UPDATED_AT - can view the updated at date
 */
function hasPermission(permissions, permission) {
    if (permissions.includes(permission)) {
        return true;
    }
    if (permissions.includes('ADMIN')) {
        return true;
    }
    return false;
}
exports.hasPermission = hasPermission;
//# sourceMappingURL=Permissions.js.map