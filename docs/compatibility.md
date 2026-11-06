# Compatibility: explicit supported subset

Checked against the current DECOMMISSION parser on 6 November 2026. Recognition of a module name alone is not a guarantee: its parameters, mappings and complete scenario must pass assessment.

| Module | Version | Scope |
| --- | --- | --- |
| gateway:CustomWebHook | 1 | First module; webhook input |
| http:ActionSendData | 3 | Restricted HTTP request configuration |
| http:MakeRequest | 4 | Restricted HTTP request configuration; response mappings limited to data and statusCode |
| builtin:BasicRouter | 1 | Supported branch filters and ordered execution; not a promise of parallel dispatch |
| util:SetVariable2 | 1 | Supported variable mappings |
| json:ParseJSON | 1 | Supported JSON parsing configuration |

Blueprints require a nonempty flow array, or one supported subflow. A top-level modules list is not the accepted blueprint format. Module names are case-sensitive.

Supported mappings include literal values, objects, arrays, available module-path references such as {{1.customer}}, and environment bindings such as {{env.API_TOKEN}}. Arbitrary Make functions and expressions are rejected. Filter comparisons include text:equal, text:notequal and text:equal:ci within the supported filter structure.

## Do not assume support for

- Scheduled Make scenarios, polling, pagination or incremental synchronisation.
- Automatic translation of native CRM/database connectors into REST calls.
- Arbitrary OAuth connector semantics or arbitrary JavaScript mapping functions.
- Arbitrary Make error directives or parallel router semantics.
- Every HTTP option, redirect behaviour or authentication mode.

The generated runtime has documented optional resilience features; these do not mean equivalent Make modules are accepted. See the example deployment guide. Validate the exact blueprint with Studio before planning migration.

## Verification boundaries

A signed replay report compares the generated Worker with an independent restricted reference interpreter using supplied mocks. It is not a recording of Make execution and contains no measured Make-versus-Worker benchmark. Test real systems in a customer-controlled environment before changing live traffic.

## Correction to the original examples

The initial four examples used unsupported blueprint structures and contained unverified speed and parity claims. They have been replaced with an actual compiler-generated example. Scheduled sync, parallel fanout and arbitrary error-router conversion must not be inferred from the earlier files. Git history preserves the correction.
