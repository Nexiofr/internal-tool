import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  RotateCcw,
  User,
  Paperclip,
  MoreVertical,
  Send,
  Save,
  Link as LinkIcon,
  UserPlus,
  Car,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EmailCase } from "@shared/schema";

const statusConfig = {
  new: { label: "Nouveau", icon: AlertCircle, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  in_progress: { label: "En cours", icon: Clock, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  replied: { label: "Répondu", icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  follow_up: { label: "À relancer", icon: RotateCcw, className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
};

const priorityConfig = {
  low: { label: "Basse", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  medium: { label: "Moyenne", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  high: { label: "Haute", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

export default function InboxPage() {
  const [selectedEmail, setSelectedEmail] = useState<EmailCase | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [draftResponse, setDraftResponse] = useState("");
  const { toast } = useToast();

  const { data: emails = [], isLoading } = useQuery<EmailCase[]>({
    queryKey: ["/api/emails"],
  });

  const updateEmailMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmailCase> }) => {
      const res = await apiRequest("PATCH", `/api/emails/${id}`, data);
      return res.json();
    },
    onSuccess: (updatedEmail) => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      if (selectedEmail?.id === updatedEmail.id) {
        setSelectedEmail(updatedEmail);
      }
      toast({ title: "Email mis à jour" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de mettre à jour l'email.", variant: "destructive" });
    },
  });

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (email.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || email.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || email.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleEmailClick = (email: EmailCase) => {
    setSelectedEmail(email);
    setDraftResponse(email.draftResponse || "");
  };

  return (
    <div className="flex h-full">
      <div className={`flex flex-col border-r ${selectedEmail ? "w-2/5" : "w-full"}`}>
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold">À répondre</h1>
            <Badge variant="secondary" className="text-sm">
              {filteredEmails.length} email{filteredEmails.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par sujet, email, nom..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-emails"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36" data-testid="select-status-filter">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="new">Nouveau</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="replied">Répondu</SelectItem>
                <SelectItem value="follow_up">À relancer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36" data-testid="select-priority-filter">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Chargement des emails...
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Aucun email à traiter</p>
              <p className="text-sm text-muted-foreground/75 mt-1">
                Les emails nécessitant une réponse humaine apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredEmails.map((email) => {
                const status = statusConfig[email.status as keyof typeof statusConfig];
                const priority = priorityConfig[email.priority as keyof typeof priorityConfig];
                const StatusIcon = status?.icon || AlertCircle;
                const isSelected = selectedEmail?.id === email.id;

                return (
                  <div
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    className={`p-4 cursor-pointer transition-colors hover-elevate ${
                      isSelected ? "bg-accent" : ""
                    }`}
                    data-testid={`email-item-${email.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">
                            {email.senderName || email.senderEmail}
                          </span>
                          {email.attachments && email.attachments.length > 0 && (
                            <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate mb-1">{email.subject}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {email.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className={status?.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status?.label}
                          </Badge>
                          <Badge variant="outline" className={priority?.className}>
                            {priority?.label}
                          </Badge>
                          {email.aiReason && (
                            <Badge variant="outline" className="text-xs">
                              {email.aiReason}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {email.receivedAt
                            ? format(new Date(email.receivedAt), "dd MMM HH:mm", { locale: fr })
                            : "—"}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {selectedEmail && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{selectedEmail.subject}</h2>
              <p className="text-sm text-muted-foreground">
                De: {selectedEmail.senderName || selectedEmail.senderEmail}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Select 
                value={selectedEmail.status || "new"}
                onValueChange={(value) => updateEmailMutation.mutate({ id: selectedEmail.id, data: { status: value as any } })}
              >
                <SelectTrigger className="w-32" data-testid="select-email-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="replied">Répondu</SelectItem>
                  <SelectItem value="follow_up">À relancer</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-email-actions">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem data-testid="action-assign">
                    <User className="h-4 w-4 mr-2" />
                    Assigner à un vendeur
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="action-link-vehicle">
                    <Car className="h-4 w-4 mr-2" />
                    Lier à un véhicule
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="action-link-client">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Lier à un client
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="action-add-waitlist">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer entrée liste d'attente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="content" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 w-fit">
              <TabsTrigger value="content" data-testid="tab-email-content">Contenu</TabsTrigger>
              <TabsTrigger value="response" data-testid="tab-email-response">Réponse</TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-email-notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-base">{selectedEmail.senderName || "Client"}</CardTitle>
                          <p className="text-sm text-muted-foreground">{selectedEmail.senderEmail}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {selectedEmail.receivedAt
                            ? format(new Date(selectedEmail.receivedAt), "EEEE d MMMM yyyy à HH:mm", { locale: fr })
                            : "—"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{selectedEmail.content}</p>
                      </div>
                      {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Pièces jointes</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedEmail.attachments.map((attachment, i) => (
                              <Badge key={i} variant="secondary" className="gap-1">
                                <Paperclip className="h-3 w-3" />
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {selectedEmail.aiReason && (
                    <Card className="border-amber-500/20 bg-amber-500/5">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-600 dark:text-amber-400">
                              Motif d'escalade IA
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedEmail.aiReason}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="response" className="flex-1 m-0 flex flex-col">
              <div className="p-4 flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" data-testid="button-ai-suggest">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Suggestion IA
                  </Button>
                </div>
                <Textarea
                  placeholder="Rédigez votre réponse..."
                  className="flex-1 min-h-[200px] resize-none"
                  value={draftResponse}
                  onChange={(e) => setDraftResponse(e.target.value)}
                  data-testid="textarea-response"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" data-testid="button-save-draft">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder brouillon
                  </Button>
                  <Button data-testid="button-send-response">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 m-0">
              <div className="p-4">
                <Textarea
                  placeholder="Notes internes sur cet email..."
                  className="min-h-[200px]"
                  defaultValue={selectedEmail.internalNotes || ""}
                  data-testid="textarea-notes"
                />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" data-testid="button-save-notes">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
