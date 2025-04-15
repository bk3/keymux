import { useEffect, useState } from "react";
import { Action, ActionPanel, Form, Icon, Toast, showToast, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { CommandConfig, storage } from "../utils";

const modifierOptions = [
  ['command', 'Command (⌘)'],
  ['control', 'Control (⌃)'],
  ['option', 'Option (⌥)'],
  ['shift', 'Shift (⇧)'],
];

interface CreateCommandProps {
  id?: string;
}

export default function CreateCommand({ id }: CreateCommandProps) {
  const { pop } = useNavigation()
  const [loading, setLoading] = useState(true)

  async function loadConfig() {
    setLoading(true);

    const command = id ? await storage.getCommand(id) : null;
    if (!id || !command) {
      setLoading(false)
      return;
    }

    setValue('title', command.title)
    setValue('description', command.description)
    setValue('shortcutKey', command.shortcutKey)
    setValue('modifiers', command.modifiers)
    setValue('commandKeys', command.commandKeys)
    setLoading(false)
  }

  useEffect(() => {
    loadConfig()
  }, [])


  const { handleSubmit, itemProps: items, setValue } = useForm<Omit<CommandConfig, 'id'>>({
    onSubmit: async (values) => {
      if (id) {
        await storage.updateCommand(id, values);
      } else {
        await storage.saveCommand(values);
      }

      showToast({
        style: Toast.Style.Success,
        title: "Success!",
        message: `Command ${id ? 'updated' : 'created'}`,
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

  return (
    <Form
      isLoading={loading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} icon={Icon.Check} />
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
        onChange={v => setValue('shortcutKey', v.substring(v.length - 1, v.length)?.toUpperCase())}
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
        onChange={v => setValue('commandKeys', v.toUpperCase())}
      />
    </Form>
  );
}

