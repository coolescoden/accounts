/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

/*
 * Permissions
 * ADMIN - can do everything
 * VIEW_PASSWORD - can view the hashed password
 * VIEW_EMAIL - can view the email
 * VIEW_CREATED_AT - can view the created at date
 * VIEW_UPDATED_AT - can view the updated at date
 * UPDATE_PASSWORD - can update the hashed password
 * UPDATE_USERNAME - can update the username
 * DATA_SET_PERMISSIONS - can set permissions for other users
 * DATA_REMOVE_USER - can remove users
 * DATA_DELETE - can delete data
 */

export function hasPermission(permissions: string[], permission: string): boolean {
    if(permissions.includes(permission)) {
        return true;
    }
    if(permissions.includes('ADMIN')) {
        return true;
    }
    return false;
}