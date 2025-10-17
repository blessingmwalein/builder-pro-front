# If you are using Yarn v1, use npx for shadcn commands (not yarn dlx):

# 1. Install shadcn peer dependencies (with yarn)
yarn add class-variance-authority lucide-react tailwind-merge tailwindcss-animate

# 2. Initialize shadcn (if not already done)
npx shadcn init

# 3. Add components using npx (all lowercase names)
npx shadcn add button
npx shadcn add input
npx shadcn add select
npx shadcn add popover
npx shadcn add calendar
npx shadcn add date-picker
npx shadcn add data-table
npx shadcn add textarea
npx shadcn add badge
npx shadcn add card
npx shadcn add alert
npx shadcn add dropdown-menu
npx shadcn add avatar
npx shadcn add dialog
npx shadcn add tooltip
npx shadcn add switch
npx shadcn add table

# 4. Remove any custom/conflicting files in src/components/ui (e.g. Button.tsx, Select.tsx, DatePicker.tsx, Calendar.tsx, etc.)
# 5. Update all imports to use the new shadcn/ui components (all lowercase filenames):
#    import { Button } from "@/components/ui/button";
#    import { Select } from "@/components/ui/select";
#    import { DatePicker } from "@/components/ui/date-picker";
#    import { Calendar } from "@/components/ui/calendar";
