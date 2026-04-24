[**universal-stores**](../README.md)

***

[universal-stores](../README.md) / batchEffects

# Function: batchEffects()

> **batchEffects**(`action`): `void`

Defined in: [stores.js/src/lib/effect.ts:162](https://github.com/cdellacqua/stores.js/blob/main/src/lib/effect.ts#L162)

Run the passed function, enqueueing and deduplicating the effects it may trigger, in order to
run them just at the end to avoid "glitches".

NOTE: batchEffects can be nested, all updates will automatically be accumulated in the outmost "batch" before
the effects are executed.

## Parameters

### action

() => `void`

A function that directly or indirectly updates one or more stores.

## Returns

`void`
