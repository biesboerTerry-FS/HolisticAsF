import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
	getMessages,
	markMessageRead,
	sendMessage,
} from "../../data/portalData";

const formatDate = (value) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? value
		: date.toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
};

/** Role-scoped inbox with read/unread state and a detail view. */
const MessagesPanel = ({ role }) => {
	const [messages, setMessages] = useState(() => getMessages(role));
	const [selectedId, setSelectedId] = useState(null);
	const [composing, setComposing] = useState(false);
	const [form, setForm] = useState({ subject: "", body: "" });

	const selected = useMemo(
		() => messages.find((message) => message.id === selectedId) || null,
		[messages, selectedId],
	);
	const unread = messages.filter((message) => !message.read).length;

	const openMessage = (message) => {
		setSelectedId(message.id);
		setMessages(markMessageRead(message.id));
	};

	const submit = (event) => {
		event.preventDefault();
		if (!form.subject.trim()) {
			toast.error("Please add a subject");
			return;
		}
		sendMessage({
			fromRole: role,
			toRole: role === "admin" ? "employee" : "admin",
			sender: role === "admin" ? "Store Manager" : "Jordan Rivera",
			subject: form.subject.trim(),
			body: form.body.trim(),
		});
		setMessages(getMessages(role));
		setForm({ subject: "", body: "" });
		setComposing(false);
		toast.success("Message sent");
	};

	return (
		<section
			data-testid="messages-inbox"
			className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-5"
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold tracking-tight">Messages</h3>
					<p className="text-xs text-primary-forest-green/55">
						{unread ? `${unread} unread · ` : ""}Inbox for {role}s
					</p>
				</div>
				<button
					onClick={() => setComposing((value) => !value)}
					className="rounded-full bg-primary-forest-green px-4 py-2 text-sm font-medium text-primary-cream transition hover:opacity-90"
				>
					{composing ? "Cancel" : "New message"}
				</button>
			</div>

			{composing ? (
				<form
					onSubmit={submit}
					className="mt-4 space-y-3 rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/50 p-4"
				>
					<input
						aria-label="Message subject"
						placeholder="Subject"
						value={form.subject}
						onChange={(event) =>
							setForm((previous) => ({ ...previous, subject: event.target.value }))
						}
						className="w-full rounded-xl border border-primary-forest-green/10 bg-primary-warm-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-secondary-golden-honey/60"
					/>
					<textarea
						aria-label="Message body"
						rows={3}
						placeholder="Write your message…"
						value={form.body}
						onChange={(event) =>
							setForm((previous) => ({ ...previous, body: event.target.value }))
						}
						className="w-full resize-y rounded-xl border border-primary-forest-green/10 bg-primary-warm-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-secondary-golden-honey/60"
					/>
					<button
						type="submit"
						className="rounded-full bg-primary-forest-green px-4 py-2 text-sm font-medium text-primary-cream"
					>
						Send message
					</button>
				</form>
			) : null}

			<div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
				<ul className="space-y-2">
					{messages.length === 0 ? (
						<li className="rounded-2xl border border-dashed border-primary-forest-green/15 p-6 text-center text-sm text-primary-forest-green/60">
							No messages yet.
						</li>
					) : (
						messages.map((message) => (
							<li key={message.id}>
								<button
									onClick={() => openMessage(message)}
									data-testid={`message-${message.id}`}
									className={`w-full rounded-2xl border px-3.5 py-3 text-left transition hover:border-secondary-golden-honey/40 ${
										selectedId === message.id
											? "border-secondary-golden-honey/60 bg-secondary-golden-honey/10"
											: "border-primary-forest-green/10 bg-secondary-soft-beige/40"
									}`}
								>
									<div className="flex items-start justify-between gap-2">
										<p className="flex items-center gap-2 truncate text-sm font-medium">
											{!message.read ? (
												<span
													aria-label="Unread"
													className="h-2 w-2 shrink-0 rounded-full bg-secondary-golden-honey"
												/>
											) : null}
											<span className="truncate">{message.subject}</span>
										</p>
										<span className="whitespace-nowrap text-[11px] text-primary-forest-green/50">
											{formatDate(message.date)}
										</span>
									</div>
									<p className="mt-1 truncate text-xs text-primary-forest-green/60">
										From {message.sender}
									</p>
								</button>
							</li>
						))
					)}
				</ul>

				<div className="rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/40 p-4">
					{selected ? (
						<>
							<p className="text-xs uppercase tracking-[0.14em] text-primary-forest-green/50">
								{selected.read ? "Read" : "New"} · {formatDate(selected.date)}
							</p>
							<h4 className="mt-1 text-base font-semibold">{selected.subject}</h4>
							<p className="mt-1 text-xs text-primary-forest-green/60">
								From {selected.sender}
							</p>
							<p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-primary-forest-green/80">
								{selected.body}
							</p>
						</>
					) : (
						<p className="py-10 text-center text-sm text-primary-forest-green/55">
							Select a message to read it.
						</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default MessagesPanel;
