import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { invite as baseInvite } from '~/api/general';
import type { Organization } from '~/types';

import { config } from 'config';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useFormWithDraft } from '~/hooks/use-draft-form';
import { useMutation } from '~/hooks/use-mutations';
import { dialog } from '~/modules/common/dialoger/state';
import { Button } from '~/modules/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/modules/ui/form';
import { Badge } from '../ui/badge';
import SelectRole from './form-fields/select-role';
import { MultiEmail } from './multi-email';
import { useForm, useWatch, type UseFormProps } from 'react-hook-form';

interface Props {
  organization?: Organization;
  type?: 'system' | 'organization';
  callback?: () => void;
  dialog?: boolean;
  withDraft?: boolean;
  withButtons?: boolean;
  initValues?: FormValues | null;
  onValuesChange?: (values: FormValues | null) => void;
}

const formSchema = z.object({
  emails: z.array(z.string().email('Invalid email')).min(1),
  role: z.enum(['ADMIN', 'USER', 'MEMBER']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const InviteEmailForm = ({
  organization,
  type = 'system',
  callback,
  dialog: isDialog,
  withDraft = true,
  withButtons = true,
  initValues,
  onValuesChange,
}: Props) => {
  const { t } = useTranslation();

  const formOptions: UseFormProps<FormValues> = useMemo(
    () => ({
      resolver: zodResolver(formSchema),
      defaultValues: {
        emails: [],
        role: config.rolesByType[type][config.rolesByType[type].length - 1].key,
      },
    }),
    [],
  );

  const form = withDraft ? useFormWithDraft<FormValues>('invite-users', formOptions) : useForm<FormValues>(formOptions);

  const allFields = useWatch({ control: form.control });

  const { mutate: invite, isPending } = useMutation({
    mutationFn: baseInvite,
    onSuccess: () => {
      form.reset(undefined, { keepDirtyValues: true });
      callback?.();

      if (isDialog) {
        dialog.remove();
      }

      toast.success(t('common:success.user_invited'));
    },
  });

  // TODO, make dynamic and type safe, for now it's hardcoded
  const roles = config.rolesByType[type];

  const onSubmit = (values: FormValues) => {
    invite({
      emails: values.emails,
      role: values.role,
      organizationIdentifier: organization?.id,
    });
  };

  const cancel = () => {
    form.reset();
    isDialog && dialog.remove();
  };

  // Set initial values
  useEffect(() => {
    if (initValues) {
      for (const [key, value] of Object.entries(initValues)) {
        form.setValue(key as keyof FormValues, value, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, []);

  useEffect(() => {
    onValuesChange?.(form.formState.isDirty ? (allFields as FormValues) : null);
  }, [onValuesChange, allFields]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="emails"
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <FormControl>
                <MultiEmail placeholder={t('common:add_email')} emails={value} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <FormItem className="flex-row gap-4 items-center">
              <FormLabel>{t('common:role')}</FormLabel>
              <FormControl>
                <SelectRole roles={roles} value={value} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {withButtons && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" loading={isPending} className="relative">
              {!!form.getValues('emails')?.length && (
                <Badge className="py-0 px-1 absolute -right-2 min-w-5 flex justify-center -top-2">{form.getValues('emails')?.length}</Badge>
              )}{' '}
              <Send size={16} className="mr-2" />
              {t('common:invite')}
            </Button>
            {form.formState.isDirty && (
              <Button type="reset" variant="secondary" onClick={cancel}>
                {t('common:cancel')}
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
};

export default InviteEmailForm;
