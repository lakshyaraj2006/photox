import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import type { Photo } from "@/pages/photos/PhotoListings";
import { useEffect, useState } from "react";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const AddSchema = z.object({
    title: z.string({ error: "Title cannot be empty!" }),
    description: z.string({ error: "Description cannot be empty!" }),
    photos: z.array(z.string()).nullable()
})

function AddAlbum() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof AddSchema>>({
        resolver: zodResolver(AddSchema),
        defaultValues: {
            title: "",
            description: "",
            photos: null
        }
    });
    const [photos, setPhotos] = useState<Record<string, string>[] | null>(null);
    const { auth } = useAuth();

    useEffect(() => {
        fetchPhotosToAdd();
    }, []);

    const fetchPhotosToAdd = async () => {
        try {
            const { accessToken } = auth;
            const response = await axiosInstance.get('/photos/user', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setPhotos(response.data.data.map((e: Photo) => {
                return {[`${e._id}`]: e.url}
            }))
        } catch (error) {

        }
    }

    const onSubmit = async (data: z.infer<typeof AddSchema>) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/albums/create', data, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });

            const { success, message } = response.data;

            if (success) {
                toast.success(message);
                form.reset();
                setLoading(false);

                setTimeout(() => {
                    navigate("/albums");
                }, 2700);
            } else {
                toast.error(message);
                setLoading(false);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const { message } = error.response.data;
                toast.error(message);
                setLoading(false);
            } else {
                toast.error("Some error occurred!");
                setLoading(false);
            }
        }
    }

    if (photos === null) {
        return <div>Loading photos...</div>;
    }


    return (
        <main className="my-6 flex flex-col justify-center overflow-hidden max-w-8xl w-full px-24 space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter album title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Describe your album" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="photos"
                        render={({ field }) => {
                            const allPhotos = photos ?? [];
                            const selected = field.value ?? [];

                            const allSelected = selected.length === allPhotos.length;

                            const handleSelectAll = () => {
                                field.onChange(allSelected ? [] : allPhotos.flatMap((e) => Object.keys(e)));
                            };

                            return (
                                <FormItem>
                                    <FormLabel>
                                        Photos <span className="text-destructive">* optional</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div>
                                            <div className="mb-4">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={handleSelectAll}
                                                >
                                                    {allSelected ? "Deselect All" : "Select All"}
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-baseline">
                                                {allPhotos.map((photo) => {
                                                    const [k, v] = Object.entries(photo)[0];
                                                    const isChecked = selected.includes(k);

                                                    return (
                                                        <div
                                                            key={k}
                                                            className="relative cursor-pointer group"
                                                        >
                                                            <img
                                                                src={v}
                                                                alt="Select"
                                                                className="w-full object-cover rounded-md border transition"
                                                                onClick={() => {
                                                                    const updated = isChecked
                                                                        ? selected.filter((id) => id !== k)
                                                                        : [...selected, k];
                                                                    field.onChange(updated);
                                                                }}
                                                            />
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onCheckedChange={() => {
                                                                    const updated = isChecked
                                                                        ? selected.filter((id) => id !== k)
                                                                        : [...selected, k];
                                                                    field.onChange(updated);
                                                                }}
                                                                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <Button disabled={loading}>
                        {
                            loading
                                ? <><Loader2Icon className="animate-spin" /> Creating Album...</>
                                : <><PlusCircleIcon /> Create Album</>
                        }
                    </Button>
                </form>
            </Form>
        </main>
    );
}

export default AddAlbum;
