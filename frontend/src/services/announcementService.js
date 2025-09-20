import api from '../api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const createAnnouncementRequest = (announcementData) =>
    api.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, announcementData);

export const getAllAnnouncementsRequest = () =>
    api.get(API_ENDPOINTS.ANNOUNCEMENTS.GET_ALL);

export const getAnnouncementByIdRequest = (id) =>
    api.get(API_ENDPOINTS.ANNOUNCEMENTS.GET(id));

export const updateAnnouncementRequest = (id, data) =>
    api.patch(API_ENDPOINTS.ANNOUNCEMENTS.UPDATE(id), data);

export const deleteAnnouncementRequest = (id) =>
    api.delete(API_ENDPOINTS.ANNOUNCEMENTS.DELETE(id));
