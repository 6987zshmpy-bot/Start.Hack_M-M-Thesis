import { useKnowledgeStore, KBItem } from "../stores/knowledgeStore";
import partnersData from "../data/partners.json";
import topicsData from "../data/topics.json";

export const KnowledgeInjectionService = {
  /**
   * Injects partner-specific knowledge base items into the store for a specific topic.
   * This is typically called when a student registers a thesis or selects a topic.
   */
  injectPartnerKnowledge: (topicId: string, supervisorId: string) => {
    const topic = topicsData.find(t => t.id === topicId);
    if (!topic || !topic.companyId) return;

    // Map companyId to partnerId in partners.json
    // For this prototype, we'll use a simple mapping or naming convention
    const partnerMap: Record<string, string> = {
      "company-01": "nestle",
      "company-03": "abb"
    };

    const partnerId = partnerMap[topic.companyId];
    console.log(`[KnowledgeInjectionService] Topic: ${topicId}, Company: ${topic.companyId}, Partner: ${partnerId}`);
    if (!partnerId) return;

    const partner = (partnersData as any[]).find(p => p.partnerId === partnerId);
    if (!partner) {
      console.warn(`[KnowledgeInjectionService] Partner not found: ${partnerId}`);
      return;
    }

    const knowledgeStore = useKnowledgeStore.getState();
    console.log(`[KnowledgeInjectionService] Injecting ${partner.items.length} items for ${partner.name}`);

    partner.items.forEach((item: any) => {
      // Check if item already exists to avoid duplicates
      const exists = knowledgeStore.items.some((ki: KBItem) => ki.id === item.id);
      if (!exists) {
        const newItem: KBItem = {
          ...item,
          scope: "topic",
          topicId: topicId,
          createdBy: supervisorId,
          category: item.category as any
        };
        knowledgeStore.addItem(newItem);
        console.log(`[KnowledgeInjectionService] Added: ${item.title}`);
      } else {
        console.log(`[KnowledgeInjectionService] Item already exists: ${item.title}`);
      }
    });

    console.log(`[KnowledgeInjectionService] Injected ${partner.items.length} items for partner: ${partner.name}`);
  }
};
