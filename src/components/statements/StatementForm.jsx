import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function parseValue(valueJson) {
  try {
    return JSON.parse(valueJson);
  } catch {
    return valueJson;
  }
}

export default function StatementForm({ request, editable, onSave, saving }) {
  const fields = useMemo(
    () => request?.template?.sections?.flatMap((s) => s.fields.map((f) => ({ ...f, sectionKey: s.key }))) ?? [],
    [request],
  );
  const formulaTargets = useMemo(() => {
    const set = new Set();
    for (const s of request?.template?.sections ?? []) {
      for (const f of s.fields) {
        if (f.formulas?.length) set.add(f.id);
      }
    }
    return set;
  }, [request]);

  const [values, setValues] = useState({});

  const displayVal = (field) => {
    if (values[field.id] !== undefined) return values[field.id];
    const existing = request.values?.find((v) => v.fieldId === field.id);
    return existing ? parseValue(existing.valueJson) : '';
  };

  const bySection = useMemo(() => {
    const map = new Map();
    for (const f of fields) {
      if (!map.has(f.sectionKey)) map.set(f.sectionKey, []);
      map.get(f.sectionKey).push(f);
    }
    return map;
  }, [fields]);

  return (
    <div className="flex flex-col gap-4">
      {[...bySection.entries()].map(([sectionKey, sectionFields]) => (
        <div key={sectionKey} className="rounded-md border border-slate-200 p-3">
          <h3 className="mb-2 text-sm font-semibold uppercase text-slate-700">{sectionKey}</h3>
          <div className="flex flex-col gap-2">
            {sectionFields.map((f) => {
              const readOnly = formulaTargets.has(f.id);
              return (
                <label key={f.id} className="flex flex-col gap-1 text-sm text-slate-700">
                  {f.labelKey || f.key}
                  {readOnly ? (
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-800">{displayVal(f)}</span>
                  ) : (
                    <Input
                      type="number"
                      step="any"
                      disabled={!editable}
                      value={displayVal(f)}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [f.id]: Number(e.target.value) }))
                      }
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {editable && onSave ? (
        <Button
          type="button"
          disabled={saving}
          onClick={() =>
            onSave(
              fields
                .filter((f) => !formulaTargets.has(f.id))
                .map((f) => ({
                  fieldId: f.id,
                  valueJson: values[f.id] ?? displayVal(f) ?? 0,
                })),
            )
          }
        >
          {saving ? '...' : 'Save'}
        </Button>
      ) : null}
    </div>
  );
}
