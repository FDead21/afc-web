// src/components/admin/IngredientSelector.tsx
'use client';

import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Ingredient = {
  id: string;
  name: string;
};

export default function IngredientSelector({
  allIngredients,
  linkedIngredientIds,
}: {
  allIngredients: Ingredient[];
  linkedIngredientIds: string[];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(linkedIngredientIds);

  const handleCheckboxChange = (ingredientId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, ingredientId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== ingredientId));
    }
  };

  return (
    <div className="space-y-2">
      {/* This hidden input will send the selected IDs to the server action */}
      <input type="hidden" name="ingredient_ids" value={JSON.stringify(selectedIds)} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded-md">
        {allIngredients.map((ingredient) => (
          <div key={ingredient.id} className="flex items-center space-x-2">
            <Checkbox
              id={`ingredient-${ingredient.id}`}
              checked={selectedIds.includes(ingredient.id)}
              onCheckedChange={(checked) => handleCheckboxChange(ingredient.id, !!checked)}
            />
            <Label htmlFor={`ingredient-${ingredient.id}`}>{ingredient.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}