import { Action, ActionPanel, Form, Icon, Toast, showToast, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { useState } from "react";
import { nanoid } from 'nanoid'
import { CommandConfig } from '../utils/types'

const modifierOptions = [
  ['command', 'Command (⌘)'],
  ['control', 'Control (⌃)'],
  ['option', 'Option (⌥)'],
  ['shift', 'Shift (⇧)'],
];

export default function Command() {
  const { pop } = useNavigation()
  const [shortcutKey, setShortcutKey] = useState('')

  const { handleSubmit, itemProps: items } = useForm<Omit<CommandConfig, 'id'>>({
    onSubmit(values) {
      showToast({
        style: Toast.Style.Success,
        title: "Yay!",
        message: `${values.title} created`,
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
        value={shortcutKey}
        onChange={v => setShortcutKey(v.substring(v.length - 1, v.length))}
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
      />
    </Form>
  );
}

