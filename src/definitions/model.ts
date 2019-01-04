import { Request } from 'express'
import { Document } from 'mongoose';
import { IPermission } from '../models/permissionSchema';
import { SchemaRolePermission } from '../models/roleSchema';
import { IUser } from '../models/userSchema';

type RequiredAttrsPath = {
    name: string,
    required: boolean
}

export type ObjectPath = RequiredAttrsPath & {
    complex: true,
    name: string,
    type: 'Object',
    children: Path[]
}
type ArrayPath = RequiredAttrsPath & {
    complex: true,
    type: 'Array',
    label: string,
    children: Path[]
}
type FieldPath = RequiredAttrsPath & {
    type: 'Number' | 'String' | 'Boolean' | 'ObjectId',
}
export type Path = FieldPath | ObjectPath | ArrayPath

export type HasPermissionCallback = (error: Error, hasPermission?: boolean, reason?: string) => void

export type UserRequest = Request & {
    user: IUser
}

export type EditRequest<T extends Document> = UserRequest & {
    doc: T
}

export type PermissionRequest<T extends Document> = EditRequest<T> & {
    perm: IPermission,
    permission: PermissionEnum,
    role: PermissionEnum
}

type GetPermissionCallback = (error: Error, query: any) => void
type GetPermission = (user: IUser, callback: GetPermissionCallback) => void
type AddPermision = (user: IUser, callback: HasPermissionCallback) => void
type EditPermision = (user: IUser, doc: Document, callback: HasPermissionCallback) => void
export type PermissionChecks = {
    getQuery: GetPermission,
    hasAdminPermission: EditPermision,
    hasEditPermission: EditPermision,
    hasAddPermission: AddPermision,
    hasUpdatePermission: EditPermision,
    hasDeletePermission: EditPermision,
}
export type ServeOptions = {
    MAX_RESULTS?: number,
    name?: string
} & Partial<PermissionChecks>
export type InfoModel = {
    name: string,
    label: string,
    route: string,
    paths: Path[],
    model: any
}

export enum PermissionEnum {
    ADMIN = 5,
    DELETE = 4,
    UPDATE = 3,
    READ = 2,
    ADD = 1,
}

const PERMISSION_MODEL = 'Permission'
const ROLE_MODEL = 'Role'
export { PERMISSION_MODEL, ROLE_MODEL }

export type FullPathTypes = { type: string } | { type: 'Ref' | 'ArrayRef', to: string } | {}