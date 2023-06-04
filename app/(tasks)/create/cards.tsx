import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function IconRadioButtons({
  title,
  description,
  items,
}: {
  title: string
  description: string
  form: any
  items: {
    value: string
    label: string
    icon: any
  }[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <p>{description}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup defaultValue="status" className="grid grid-cols-5 gap-4">
          {items.map((item) => (
            <Label
              htmlFor={item.value}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem
                value={item.value}
                id={item.value}
                className="sr-only"
              />
              <item.icon className="mb-3 h-6 w-6" />
              {item.label}
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
