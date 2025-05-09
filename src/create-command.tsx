import { useEffect, useState } from "react";
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
import {
  CommandConfig,
  CategoryConfig,
  storage,
  checkForShortcutClash,
} from "../utils";
import CreateCategory from "./create-category";

const modifierOptions = [
  ["command", "Command (⌘)"],
  ["control", "Control (⌃)"],
  ["option", "Option (⌥)"],
  ["shift", "Shift (⇧)"],
];

interface CreateCommandProps {
  id?: string;
  category?: string;
}

export default function CreateCommand({ id, category }: CreateCommandProps) {
  const { pop } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryConfig[]>([]);

  const {
    handleSubmit,
    itemProps: items,
    setValue,
    setValidationError,
  } = useForm<Omit<CommandConfig, "id">>({
    onSubmit: async (values) => {
      const allCommands = await storage.getAllCommands();
      const allCategories = await storage.getAllCategories();

      const commandConfig = {
        type: "command" as const,
        shortcutKey: values.shortcutKey,
        category: values.category,
        id: id,
      };

      const { hasClash, message } = checkForShortcutClash(
        commandConfig,
        allCommands,
        allCategories,
      );

      if (hasClash) {
        setValidationError("shortcutKey", message);
        showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: message || "Shortcut key already exists",
        });
        return;
      }

      setValidationError("shortcutKey", undefined);
      if (id) {
        await storage.updateCommand(id, values);
      } else {
        await storage.saveCommand(values);
      }

      showToast({
        style: Toast.Style.Success,
        title: "Success!",
        message: `Command ${id ? "updated" : "created"}`,
      });

      pop();
    },
    validation: {
      title: FormValidation.Required,
      shortcutKey: (value) => {
        if (value && value.length !== 1) {
          return "Shortcut key must be a single character";
        } else if (!value) {
          return "The item is required";
        }
      },
      modifiers: FormValidation.Required,
      commandKeys: FormValidation.Required,
    },
  });

  async function loadCommandData() {
    setLoading(true);
    try {
      const cats = await storage.getAllCategories();
      setCategories(cats);

      const command = id ? await storage.getCommand(id) : null;
      setValue("category", command?.category || category || "no-category");

      if (!id || !command) return;

      setValue("title", command.title);
      setValue("description", command.description);
      setValue("shortcutKey", command.shortcutKey);
      setValue("modifiers", command.modifiers);
      setValue("commandKeys", command.commandKeys);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCommandData();
  }, []);

  return (
    <Form
      isLoading={loading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Submit"
            onSubmit={handleSubmit}
            icon={Icon.Check}
          />
          <Action.Push
            title="Create Category"
            icon={Icon.Plus}
            shortcut={{ modifiers: ["cmd"], key: "n" }}
            target={<CreateCategory />}
            onPop={loadCommandData}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        title="Title"
        placeholder="Enter a title"
        info="Title of the command to be shown in the command list"
        {...items.title}
      />

      <Form.TextField
        title="Description"
        placeholder="Enter a description"
        info="Add helpful information about your command"
        {...items.description}
      />

      <Form.Separator />

      <Form.TextField
        title="Shortcut Key"
        placeholder="e.g., p"
        info="Key to trigger command"
        {...items.shortcutKey}
        onChange={(v) => {
          setValidationError("shortcutKey", undefined);
          setValue(
            "shortcutKey",
            v.substring(v.length - 1, v.length)?.toUpperCase(),
          );
        }}
      />

      <Form.Separator />

      <Form.TagPicker
        title="Modifiers"
        placeholder="Select modifier keys"
        info="Select one or more modifier keys"
        {...items.modifiers}
      >
        {modifierOptions.map(([value, title]) => (
          <Form.TagPicker.Item key={value} value={value} title={title} />
        ))}
      </Form.TagPicker>

      <Form.TextField
        title="Keys"
        placeholder="e.g., abc"
        info="Enter the key/s that will be run with above modifiers"
        {...items.commandKeys}
        onChange={(v) => setValue("commandKeys", v.toUpperCase())}
      />

      <Form.Separator />

      <Form.Dropdown
        isLoading={loading}
        title="Category"
        placeholder="Select a category"
        {...items.category}
      >
        {!loading && (
          <>
            <Form.Dropdown.Item
              key="no-category"
              value="no-category"
              title="None"
            />
            {categories.map((category) => (
              <Form.Dropdown.Item
                key={category.id}
                value={category.id}
                title={category.title}
              />
            ))}
          </>
        )}
      </Form.Dropdown>
      <Form.Description text="Press ⌘+N to create a new category" />
    </Form>
  );
}
