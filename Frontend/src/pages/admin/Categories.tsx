import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, Category } from "@/services/api";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminCategories = () => {
  const { t } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await api.categories.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(t("admin.failedToLoadCategories"));
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
      await api.categories.delete(id);
      setCategories(categories.filter((category) => category.id !== id));
      toast.success(t("admin.categoryDeleted"));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(t("admin.failedToDeleteCategory"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error(t("admin.categoryNameRequired"));
      return;
    }

    try {
      if (editingCategory) {
        const updated = await api.categories.update(editingCategory.id, {
          name: categoryName,
        });
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? updated : cat
          )
        );
        toast.success(t("admin.categoryUpdated"));
      } else {
        const created = await api.categories.create({ name: categoryName });
        setCategories([...categories, created]);
        toast.success(t("admin.categoryCreated"));
      }

      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(
        editingCategory
          ? t("admin.failedToUpdateCategory")
          : t("admin.failedToCreateCategory")
      );
    }
  };

  const openCreateModal = () => {
    setCategoryName("");
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("admin.categories")}</h1>
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            {t("admin.addCategory")}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("admin.searchCategories")}
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
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">{t("admin.noCategories")}</p>
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
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(category)}
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
                                {t("admin.confirmDeleteCategoryMessage") +
                                  " " +
                                  category.name}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("common.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId === category.id ? (
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
              {editingCategory
                ? t("admin.editCategory")
                : t("admin.addCategory")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("admin.categoryName")}</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder={t("admin.enterCategoryName")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmit}>
              {editingCategory ? t("admin.update") : t("admin.add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;
