function RefreshOrdersButton({
  onRefreshClick,
}: {
  onRefreshClick: () => void;
}): JSX.Element {
  return (
    <button type="button" onClick={onRefreshClick}>
      RefreshOrdersButton
    </button>
  );
}

export default RefreshOrdersButton;
