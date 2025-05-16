import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, Tag } from "@/services/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const AdminTags = () => {
  const { t } = useLanguage();

  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const data = await api.tags.getAll();
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error(t("admin.failedToLoadTags"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Client-side filtering
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.tags.delete(id);
      setTags(tags.filter((tag) => tag.id !== id));
      toast.success(t("admin.tagDeleted"));
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error(t("admin.failedToDeleteTag"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!tagName.trim()) {
      toast.error(t("admin.tagNameRequired"));
      return;
    }

    try {
      if (editingTag) {
        const updated = await api.tags.update(editingTag.id, { name: tagName });
        setTags(tags.map((tag) => (tag.id === editingTag.id ? updated : tag)));
        toast.success(t("admin.tagUpdated"));
      } else {
        const created = await api.tags.create({ name: tagName });
        setTags([...tags, created]);
        toast.success(t("admin.tagCreated"));
      }

      closeModal();
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error(
        editingTag ? t("admin.failedToUpdateTag") : t("admin.failedToCreateTag")
      );
    }
  };

  const openCreateModal = () => {
    setTagName("");
    setEditingTag(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setTagName("");
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("admin.tags")}</h1>
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            {t("admin.addTag")}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("admin.searchTags")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>
            {t("common.search")}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">{t("admin.noTags")}</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.id")}</TableHead>
                  <TableHead>{t("admin.name")}</TableHead>
                  <TableHead className="text-right">
                    {t("admin.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.id}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        {tag.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(tag)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t("admin.edit")}</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">
                                {t("admin.delete")}
                              </span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                  {t("admin.confirmDelete")}
                                </div>
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("admin.confirmDeleteTagMessage") +
                                  " " +
                                  tag.name}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("common.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(tag.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId === tag.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                {t("admin.delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? t("admin.editTag") : t("admin.addTag")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("admin.tagName")}</Label>
              <Input
                id="name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder={t("admin.enterTagName")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmit}>
              {editingTag ? t("admin.update") : t("admin.add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTags;
