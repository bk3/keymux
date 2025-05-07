import {
  Action,
  ActionPanel,
  Form,
  Icon,
  Toast,
  showToast,
  useNavigation,
} from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { storage, checkForShortcutClash } from "../utils";
import { useState } from "react";
import { useEffect } from "react";

interface CategoryForm {
  title: string;
  shortcutKey: string;
  description: string;
}

export default function CreateCategory({ id }: { id?: string }) {
  const { pop } = useNavigation();
  const [loading, setLoading] = useState(true);

  const {
    handleSubmit,
    itemProps: items,
    setValue,
    setValidationError,
  } = useForm<CategoryForm>({
    onSubmit: async (values) => {
      try {
        const allCommands = await storage.getAllCommands();
        const allCategories = await storage.getAllCategories();
        
        const categoryConfig = {
          type: "category" as const,
          shortcutKey: values.shortcutKey,
          id: id
        };

        const { hasClash, message } = checkForShortcutClash(
          categoryConfig,
          allCommands,
          allCategories
        );

        if (hasClash) {
          setValidationError("shortcutKey", message);
          showToast({
            style: Toast.Style.Failure,
            title: "Error",
            message: message || "Shortcut key already exists"
          });
          return;
        }

        if (id) {
          await storage.updateCategory(id, values);
        } else {
          await storage.saveCategory(values);
        }
        showToast({
          style: Toast.Style.Success,
          title: "Category Saved",
          message: `Category "${values.title}" saved`,
        });
        pop();
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    },
    validation: {
      title: FormValidation.Required,
      shortcutKey: (value) => {
        if (value && value.length !== 1) {
          return "Shortcut key must be a single character";
        }
        if (!value) {
          return "The item is required";
        }
      },
    },
  });

  async function loadCategoryData() {
    setLoading(true);
    try {
      const category = id ? await storage.getCategory(id) : null;
      if (!category) return;

      setValue("title", category.title);
      setValue("description", category.description);
      setValue("shortcutKey", category.shortcutKey);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategoryData();
  }, []);

  return (
    <Form
      isLoading={loading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Save Category"
            onSubmit={handleSubmit}
            icon={Icon.Check}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        title="Category Title"
        placeholder="Enter category title"
        info="Title of the category"
        {...items.title}
      />

      <Form.TextField
        title="Description"
        placeholder="Enter category description"
        info="Optional description for this category"
        {...items.description}
      />

      <Form.Separator />

      <Form.TextField
        title="Shortcut Key"
        placeholder="e.g., p"
        info="Key to trigger category"
        {...items.shortcutKey}
        onChange={(v) => {
          setValidationError("shortcutKey", undefined);
          setValue("shortcutKey", v.substring(v.length - 1).toUpperCase());
        }}
      />
    </Form>
  );
}
