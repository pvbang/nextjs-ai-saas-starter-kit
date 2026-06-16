#!/usr/bin/env bash
# deliver-pro.sh — Cấp quyền read private repo Pro cho người mua sau khi xác nhận thanh toán $29.
# Đây là cơ chế GATING THỰC THI ĐƯỢC (thay cho honor-system PayPal.me):
# chỉ người trả tiền mới được GitHub invite vào private repo → người khác không clone được.
#
# Yêu cầu: biến môi trường GITHUB_TOKEN có quyền 'repo' (đã xác minh hoạt động).
# Usage:   GITHUB_TOKEN=xxx ./deliver-pro.sh <buyer_github_username>
set -euo pipefail

BUYER="${1:?Usage: ./deliver-pro.sh <buyer_github_username>}"
OWNER="pvbang"
REPO="nextjs-ai-saas-starter-kit-pro"   # private repo chứa bản Pro đầy đủ

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "❌ GITHUB_TOKEN chưa được set. Export token có quyền 'repo' rồi chạy lại." >&2
  exit 1
fi

echo "→ Đang mời '${BUYER}' vào ${OWNER}/${REPO} với quyền read-only (pull)..."

HTTP_CODE=$(curl -fsS -o /tmp/deliver_resp.json -w "%{http_code}" -X PUT \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${OWNER}/${REPO}/collaborators/${BUYER}" \
  -d '{"permission":"pull"}' || true)

case "$HTTP_CODE" in
  201) echo "✅ Đã gửi invite tới '${BUYER}'. Họ sẽ nhận email từ GitHub để accept." ;;
  204) echo "✅ '${BUYER}' đã là collaborator (đã có quyền truy cập)." ;;
  404) echo "❌ Không tìm thấy repo hoặc user. Kiểm tra repo '${OWNER}/${REPO}' đã tạo & username '${BUYER}' đúng." >&2; exit 1 ;;
  401|403) echo "❌ Token thiếu quyền 'repo' hoặc hết hạn (HTTP ${HTTP_CODE})." >&2; exit 1 ;;
  *) echo "⚠️ Phản hồi bất thường (HTTP ${HTTP_CODE}). Xem /tmp/deliver_resp.json" >&2; cat /tmp/deliver_resp.json >&2; exit 1 ;;
esac

echo "   Sau khi buyer accept invite:"
echo "   git clone https://github.com/${OWNER}/${REPO}.git"
