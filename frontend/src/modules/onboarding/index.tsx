import { useEffect, useState } from 'react';
import type { CreateOrganizationParams } from '~/api/organizations';
import type { UpdateUserParams } from '~/api/users';
import { useUserStore } from '~/store/user';
import InviteUsers from '../common/invite-users';
import CreateOrganizationForm from '../organizations/create-organization-form';
import { Step, Stepper, type StepItem } from '../ui/stepper';
import UpdateUserForm from '../users/update-user-form';
import Footer from './footer';
import type { InviteProps } from '~/api/general';

const Onboarding = () => {
  const user = useUserStore((state) => state.user);
  const [createOrganizationFormValues, setCreateOrganizationFormValues] = useState<CreateOrganizationParams | null>(null);
  const [updateUserFormValues, setUpdateUserFormValues] = useState<UpdateUserParams | null>(null);
  const [inviteFormValues, setInviteFormValues] = useState<InviteProps | null>(null);

  const [steps, setSteps] = useState<StepItem[]>([
    {
      id: 'step-1',
      label: 'Step 1 Create organization',
      optional: true,
    },
    {
      id: 'step-2',
      label: 'Step 2 Your profile',
      optional: true,
    },
  ]);

  // Add step 3 if organization is created
  useEffect(() => {
    const isAlreadyExistingStep = steps.find((step) => step.id === 'step-3');
    if (!createOrganizationFormValues) {
      if (isAlreadyExistingStep) {
        setSteps(steps.filter((step) => step.id !== 'step-3'));
      }
      return;
    }

    if (!isAlreadyExistingStep) {
      setSteps((prevSteps) => [
        ...prevSteps,
        {
          id: 'step-3',
          label: 'Step 3 Your team',
          optional: true,
        },
      ]);
    }
  }, [steps, createOrganizationFormValues]);

  return (
    <div className="absolute z-50 inset-0 bg-background flex items-center justify-center">
      <div className="w-3/5">
        <Stepper initialStep={0} steps={steps} orientation="vertical">
          {steps.map(({ label, id }, index) => {
            if (id === 'step-1') {
              return (
                <Step key={label} label={label}>
                  <div className="flex flex-col items-center justify-center my-4 border bg-secondary text-primary rounded-md p-4">
                    <div>
                      <div className="mb-4">
                        <h1 className="text-xl">Welcome to Cella</h1>
                        <p className="text-sm">Let's get started by creating your organization.</p>
                      </div>
                      <div>
                        <CreateOrganizationForm
                          initValues={createOrganizationFormValues}
                          onValuesChange={setCreateOrganizationFormValues}
                          withButtons={false}
                          withDraft={false}
                        />
                      </div>
                    </div>
                  </div>
                </Step>
              );
            }

            if (id === 'step-2') {
              return (
                <Step key={label} label={label}>
                  <div className="flex flex-col items-center justify-center my-4 border bg-secondary text-primary rounded-md p-4">
                    <div>
                      <div className="mb-4">
                        <h1 className="text-xl">Setup your profile</h1>
                      </div>
                      <div>
                        <UpdateUserForm
                          user={user}
                          initValues={updateUserFormValues}
                          onValuesChange={setUpdateUserFormValues}
                          withButtons={false}
                          withDraft={false}
                        />
                      </div>
                    </div>
                  </div>
                </Step>
              );
            }

            if (id === 'step-3') {
              return (
                <Step key={label} label={label}>
                  <div className="flex flex-col items-center justify-center my-4 border bg-secondary text-primary rounded-md p-4">
                    <div>
                      <div className="mb-4">
                        <h1 className="text-xl">Invite your team</h1>
                      </div>
                      <div>
                        <InviteUsers
                          type="organization"
                          onValuesChange={setInviteFormValues}
                          initValues={inviteFormValues}
                          withButtons={false}
                          withDraft={false}
                        />
                      </div>
                    </div>
                  </div>
                </Step>
              );
            }

            return (
              <Step key={label} label={label}>
                <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                  <h1 className="text-xl">Step {index + 1}</h1>
                </div>
              </Step>
            );
          })}
          <Footer
            createOrganizationFormValues={createOrganizationFormValues}
            updateUserFormValues={updateUserFormValues}
            inviteFormValues={inviteFormValues}
          />
        </Stepper>
      </div>
    </div>
  );
};

export default Onboarding;
