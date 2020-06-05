import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import BasicIdRestModel from '@rest-api/redux/src/restmodels/basic/BasicIdRestModel'
import ComplexIdRestModel from '@rest-api/redux/src/restmodels/ComplexIdRestModel'

export type PropsFromItem<PartialItem, PopulatedItem, Name extends string = 'item'> = {
    populated: true,
    invalidated: boolean;
    error: HttpError | null;
    loading: boolean;
} & {
        [k in Name]: PopulatedItem;
    } | {
        [k in Name]: PartialItem | null;
    } & {
        loading: boolean;
        populated: false,
        invalidated: boolean;
        error: HttpError | null;
    }



export default function useGetByIdPopulated<PopulatedType,
    FullPopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string>(
        model: Model<any, PopulatedType, FullPopulatedType, IdKey, any, any> | BasicIdRestModel<any, PopulatedType, FullPopulatedType, IdKey>,
        id: PopulatedType[IdKey]
    ): PropsFromItem<PopulatedType, FullPopulatedType> {
    const { fetchByIdPopulatedIfNeeded } = model.actions
    type Result = PropsFromItem<PopulatedType, FullPopulatedType>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, populated: false, invalidated: true, loading: false, [name]: null })
    const { getByIdPopulated, isIdPopulated, isIdFetching, isIdInvalidated, getIdError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<PopulatedType, FullPopulatedType> = {
            item: getByIdPopulated(state, id) as any,
            loading: isIdFetching(state, id),
            populated: isIdPopulated(state, id),
            invalidated: isIdInvalidated(state, id),
            error: getIdError(state, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchByIdPopulatedIfNeeded(id))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return state
}


export function useGetByIdPopulatedExtended<
    Opts,
    PopulatedType,
    FullPopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string>(
        model: ComplexIdRestModel<Opts, any, PopulatedType, FullPopulatedType, IdKey>,
        opts: Opts,
        id: PopulatedType[IdKey]
    ): PropsFromItem<PopulatedType, FullPopulatedType> {
    const { fetchByIdPopulatedIfNeeded } = model.actions
    type Result = PropsFromItem<PopulatedType, FullPopulatedType>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, populated: false, invalidated: true, loading: false, [name]: null })
    const { getByIdPopulated, isIdPopulated, isIdFetching, isIdInvalidated, getIdError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<PopulatedType, FullPopulatedType> = {
            item: getByIdPopulated(state, opts, id) as any,
            loading: isIdFetching(state, opts, id),
            populated: isIdPopulated(state, opts, id),
            invalidated: isIdInvalidated(state, opts, id),
            error: getIdError(state, opts, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchByIdPopulatedIfNeeded(opts, id))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return state
}

