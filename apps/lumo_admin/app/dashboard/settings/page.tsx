"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gql, request } from "graphql-request"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/file-upload" // Assuming you have this component
import { Palette, Building, Shield, Loader2 } from "lucide-react"

// --- Type Definitions and Zod Schemas ---
const settingsSchema = z.object({
  name: z.string().min(3, "Institution name must be at least 3 characters"),
  description: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")).optional(),
  contactEmail: z.string().email({ message: "Please enter a valid email." }).or(z.literal("")).optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color"),
});
type SettingsFormData = z.infer<typeof settingsSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});
type PasswordFormData = z.infer<typeof passwordSchema>;

interface SettingsDataResponse {
  getSettingsData: {
    name: string;
    description: string | null;
    website: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    address: string | null;
    branding: {
      primaryColor: string;
      secondaryColor: string;
      logoUrl: string | null;
    }
  };
}

// --- GraphQL ---
const GET_SETTINGS_DATA = gql` query GetSettingsData { getSettingsData { name, description, website, contactEmail, contactPhone, address, branding { primaryColor, secondaryColor, logoUrl } } }`;
const UPDATE_SETTINGS_MUTATION = gql` mutation UpdateSettings($input: UpdateSettingsInput!) { updateSettings(input: $input) { name } }`;
const CHANGE_PASSWORD_MUTATION = gql` mutation ChangePassword($input: ChangePasswordInput!) { changePassword(input: $input) }`;

const GQL_API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`;

const fetchSettingsData = async (): Promise<SettingsDataResponse> => request(GQL_API_ENDPOINT, GET_SETTINGS_DATA);

// --- Component ---
export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: queryData, isLoading: isQueryLoading } = useQuery<SettingsDataResponse>({
    queryKey: ['settingsData'],
    queryFn: fetchSettingsData,
  });

  const settingsForm = useForm<SettingsFormData>({ resolver: zodResolver(settingsSchema) });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  // ==========================================================
  // ✨ FIX: Safely transform the API data before resetting the form
  // ==========================================================
  useEffect(() => {
    if (queryData?.getSettingsData) {
      const apiData = queryData.getSettingsData;
      
      // Transform null values from the API to empty strings or undefined,
      // which react-hook-form and Zod expect for optional fields.
      settingsForm.reset({
        name: apiData.name,
        description: apiData.description ?? '',
        website: apiData.website ?? '',
        contactEmail: apiData.contactEmail ?? '',
        contactPhone: apiData.contactPhone ?? '',
        address: apiData.address ?? '',
        primaryColor: apiData.branding.primaryColor,
        secondaryColor: apiData.branding.secondaryColor,
      });
    }
  }, [queryData, settingsForm]);

  const updateSettingsMutation = useMutation({
    mutationFn: (variables: SettingsFormData) => request(GQL_API_ENDPOINT, UPDATE_SETTINGS_MUTATION, { input: variables }),
    onSuccess: () => {
      toast({ title: "Success!", description: "Your settings have been saved." });
      queryClient.invalidateQueries({ queryKey: ['settingsData'] });
    },
    onError: (err: any) => {
      const msg = err.response?.errors?.[0]?.message || "An unknown error occurred.";
      toast({ title: "Error", description: `Failed to save settings: ${msg}`, variant: "destructive" });
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: (variables: Omit<PasswordFormData, 'confirmPassword'>) => request(GQL_API_ENDPOINT, CHANGE_PASSWORD_MUTATION, { input: variables }),
    onSuccess: () => {
      toast({ title: "Success!", description: "Your password has been changed." });
      passwordForm.reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: any) => {
      const msg = err.response?.errors?.[0]?.message || "An unknown error occurred.";
      toast({ title: "Error", description: `Failed to change password: ${msg}`, variant: "destructive" });
    }
  });

  const onSettingsSubmit = (formData: SettingsFormData) => updateSettingsMutation.mutate(formData);
  const onPasswordSubmit = (formData: PasswordFormData) => changePasswordMutation.mutate(formData);
  
  const colorPresets = [{ name: "Blue", primary: "#2563eb", secondary: "#1e40af" }, { name: "Green", primary: "#16a34a", secondary: "#15803d" }];

  if (isQueryLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900">Portal Settings</h1><p className="text-gray-600 mt-1">Customize your institution's portal appearance and information</p></div>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general"><Building className="w-4 h-4 mr-2" />General</TabsTrigger>
            <TabsTrigger value="branding"><Palette className="w-4 h-4 mr-2" />Branding</TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" />Security</TabsTrigger>
          </TabsList>

          <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
            <TabsContent value="general" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Institution Information</CardTitle><CardDescription>Basic information about your institution that will be displayed on the portal.</CardDescription></CardHeader>
                <CardContent className="space-y-6 pt-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="name">Institution Name *</Label><Input id="name" {...settingsForm.register("name")} /><p className="text-sm text-red-500">{settingsForm.formState.errors.name?.message}</p></div>
                    <div className="space-y-2"><Label htmlFor="website">Website</Label><Input id="website" type="url" {...settingsForm.register("website")} /><p className="text-sm text-red-500">{settingsForm.formState.errors.website?.message}</p></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="description">Public Description</Label><Textarea id="description" rows={3} {...settingsForm.register("description")} placeholder="Brief description of your institution..." /><p className="text-sm text-red-500">{settingsForm.formState.errors.description?.message}</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="contactEmail">Contact Email</Label><Input id="contactEmail" type="email" {...settingsForm.register("contactEmail")} /><p className="text-sm text-red-500">{settingsForm.formState.errors.contactEmail?.message}</p></div>
                    <div className="space-y-2"><Label htmlFor="contactPhone">Phone Number</Label><Input id="contactPhone" {...settingsForm.register("contactPhone")} /><p className="text-sm text-red-500">{settingsForm.formState.errors.contactPhone?.message}</p></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="address">Address</Label><Textarea id="address" rows={2} {...settingsForm.register("address")} /><p className="text-sm text-red-500">{settingsForm.formState.errors.address?.message}</p></div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="branding" className="mt-6">
              <div className="space-y-6">
                <Card><CardHeader><CardTitle>Institution Logo</CardTitle><CardDescription>Upload a logo. Recommended size: 200x80px.</CardDescription></CardHeader><CardContent className="pt-6"><FileUpload onUpload={() => {}} /></CardContent></Card>
                <Card><CardHeader><CardTitle>Color Scheme</CardTitle><CardDescription>Choose colors that represent your brand.</CardDescription></CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2"><Label htmlFor="primaryColor">Primary Color</Label><div className="flex items-center gap-3"><input type="color" className="w-12 h-10 border rounded" {...settingsForm.register("primaryColor")} /><Input {...settingsForm.register("primaryColor")} /></div><p className="text-sm text-red-500">{settingsForm.formState.errors.primaryColor?.message}</p></div>
                      <div className="space-y-2"><Label htmlFor="secondaryColor">Secondary Color</Label><div className="flex items-center gap-3"><input type="color" className="w-12 h-10 border rounded" {...settingsForm.register("secondaryColor")} /><Input {...settingsForm.register("secondaryColor")} /></div><p className="text-sm text-red-500">{settingsForm.formState.errors.secondaryColor?.message}</p></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <div className="sticky bottom-0 left-0 right-0 mt-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 flex justify-end z-50">
              <Button type="submit" disabled={updateSettingsMutation.isPending || !settingsForm.formState.isDirty}>
                {updateSettingsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Changes
              </Button>
            </div>
          </form>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>For the highest security, use a strong, unique password.</CardDescription></CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-md">
                  <div className="space-y-2"><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} /><p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword?.message}</p></div>
                  <div className="space-y-2"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" {...passwordForm.register("newPassword")} /><p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword?.message}</p></div>
                  <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} /><p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword?.message}</p></div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={changePasswordMutation.isPending}>
                      {changePasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
