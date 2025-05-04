import { Action, ActionPanel, Form, Icon, Toast, showToast, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { storage } from "../utils";

interface CategoryForm {
  title: string;
  shortcutKey: string;
  description: string;
}

export default function CreateCategory({ id }: { id?: string }) {
  const { pop } = useNavigation();
  console.log('category id', id)

  const { handleSubmit, itemProps: items, setValue, setValidationError } = useForm<CategoryForm>({
    onSubmit: async (values) => {
      try {
        await storage.saveCategory(values);
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

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Category" onSubmit={handleSubmit} icon={Icon.Check} />
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