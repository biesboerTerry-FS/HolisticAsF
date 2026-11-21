import React from "react";
import MessagesPanel from "../../components/portal/MessagesPanel";

const Messages = () => (
	<div className="p-4 md:p-6 lg:p-8 text-primary-forest-green">
		<div className="mx-auto max-w-6xl space-y-6">
			<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-5 shadow-sm backdrop-blur md:p-6">
				<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-forest-green/50">
					Communication
				</p>
				<h2 className="mt-1 text-2xl font-semibold tracking-tight">
					Team <span className="text-secondary-golden-honey">messages</span>
				</h2>
				<p className="mt-1 text-sm text-primary-forest-green/65">
					Review messages from employees and customers.
				</p>
			</div>
			<MessagesPanel role="admin" />
		</div>
	</div>
);

export default Messages;
